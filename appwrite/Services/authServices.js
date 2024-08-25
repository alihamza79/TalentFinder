import { account, teams, jobSeekersTeamId, companiesTeamId } from "../config";
import { databases, databaseId } from "../config";
import db from "./dbServices";
import { initializeCollections } from "../collections";
import { ID } from "appwrite"; 
import { collections } from "../collections";
// Function to register a new user and automatically assign to a team
export async function registerUser(email, password, isEmployer) {
  try {
    // Step 1: Register the user
    const user = await account.create(ID.unique(), email, password);
    localStorage.setItem("authToken", user.$id);

    // Step 2: Authenticate the user (log in to create a session)
    await account.createEmailPasswordSession(email, password);

    // Step 3: Assign the user to a team
    await assignUserToTeam(user.$id, email, isEmployer);

    // Step 4: If the user is an employer, check if 'company' collection exists
    if (isEmployer) {
      const existingCollections = await databases.listCollections(databaseId);
      const companyCollectionExists = existingCollections.collections.some(
        (collection) => collection.name === "company"
      );

      // If the 'company' collection does not exist, create it
      if (!companyCollectionExists) {
        const companyAttributes = [
          { type: "string", name: "name", required: true, size: 500 },
          { type: "string", name: "email", required: true, size: 500 },
          { type: "string", name: "phone", required: false, size: 20 },
          { type: "string", name: "website", required: false, size: 500 },
          { type: "string", name: "since", required: false, size: 20 },
          { type: "string", name: "companySize", required: false, size: 100 },
          {
            type: "string",
            name: "allowListingVisibility",
            required: false,
            size: 10,
          },
          { type: "string", name: "aboutCompany", required: false, size: 1000 },
          { type: "string", name: "categoryTags", required: false, array: true , size: 500 }, // Mark as array
          { type: "string", name: "socials", required: false, array: true , size: 500 }, 
          { type: "string", name: "city", required: false, size: 500 },
          { type: "string", name: "address", required: false, size: 500 },
          { type: "string", name: "country", required: false, size: 100 },
          { type: "string", name: "userId", required: true, size: 500 },
        ];

        // Use dbServices to create the collection
        await db.createCollection("company", companyAttributes);
        console.log("Company collection created successfully.");

        // Re-initialize collections so the new collection is available
        await initializeCollections();
        console.log("Collections re-initialized.");
      } else {
        console.log("Company collection already exists.");
      }

      // Step 5: Check if db.company exists after reinitializing collections
      if (!db.company) {
        const companyCollection = collections.find((col) => col.name === "company");
        if (companyCollection) {
          // Initialize db.company after the collection is created
          db.company = {
            create: async (payload, id = ID.unique()) =>
              await databases.createDocument(databaseId, companyCollection.id, id, payload),
            update: async (id, payload) =>
              await databases.updateDocument(databaseId, companyCollection.id, id, payload),
            get: async (id) => await databases.getDocument(databaseId, companyCollection.id, id),
            list: async (queries) =>
              await databases.listDocuments(databaseId, companyCollection.id, queries),
            delete: async (id) => await databases.deleteDocument(databaseId, companyCollection.id, id),
          };
        }
      }

      // Create a document in the 'company' collection with the user's details
      const companyDocumentPayload = {
        name: "", // Replace with actual company name
        email: "", // Replace with actual company email
        phone: "", // Replace with actual company phone
        website: "", // Replace with actual website
        since: "", // Replace with actual foundation year
        companySize: "", // Replace with actual company size
        allowListingVisibility: "", // Replace with actual visibility option
        aboutCompany: "", // Replace with actual aboutCompany description
        categoryTags: [], // Replace with actual category tags
        socials: [], // Replace with actual social media links
        city: "", // Replace with actual city
        address: "", // Replace with actual address
        country: "", // Replace with actual country
        userId: user.$id, // Store the user's ID in the document
      };

      // Use dbServices to create the document in the company collection
      await db.company.create(companyDocumentPayload);
      console.log("Company document created successfully.");
    }

    return user;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

// Function to assign the authenticated user to a team (can be called separately)
export async function assignUserToTeam(userId, email, isEmployer) {
  try {
    // Determine which team to add the user to based on the selection
    const teamId = isEmployer ? companiesTeamId : jobSeekersTeamId;
    // Define roles (optional, based on your team setup)
    const roles = ["member"];

    // Define redirect URL after accepting the invite
    const redirectUrl = "http://localhost:3000/";

    // Add the authenticated user to the appropriate team
    await teams.createMembership(
      teamId, // The team ID
      roles, // Roles, e.g., ["member"]
      email, // The user's email (optional if using userId)
      userId, // The user's ID (optional if using email)
      undefined, // Phone number (not provided)
      redirectUrl // The URL for redirecting after invitation acceptance
    );
  } catch (error) {
    console.error("Error during team assignment:", error);
    throw error;
  }
}

// Function to log out the user
export const signOutUser = async () => {
  try {
    await account.deleteSession("current"); // End the current session
    localStorage.removeItem("authToken"); // Remove auth token
  } catch (error) {
    throw error;
  }
};

// Function to get the currently authenticated user
export const getCurrentUser = async () => {
  try {
    const user = await account.get(); // Get the current user
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to check if the user is authenticated
export const checkAuth = async () => {
  try {
    await account.get(); // If no error is thrown, the user is authenticated
    return true;
  } catch (error) {
    return false; // User is not authenticated
  }
};

// Function to send a password recovery email
export const sendPasswordRecoveryEmail = async (email) => {
  const resetPasswordUrl = `${window.location.origin}/reset-password`; // Construct reset URL
  try {
    await account.createRecovery(email, resetPasswordUrl);
  } catch (error) {
    throw error;
  }
};
