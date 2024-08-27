import { initializeCollections, collections } from "@/appwrite/collections";
import { databases, databaseId } from "@/appwrite/config";
import { ID, Permission, Role } from "appwrite";
import db from "@/appwrite/Services/dbServices";

import { teams } from "@/appwrite/config";
// Function to create a company collection and insert a document
export const createCompanyCollectionAndDocument = async (
  userId,
  companyData
) => {
  try {
    // Check if the company collection already exists
    const existingCollections = await databases.listCollections(databaseId);
    const companyCollectionExists = existingCollections.collections.some(
      (collection) => collection.name === "company"
    );

    // If the company collection doesn't exist, create it
    if (!companyCollectionExists) {
      const companyAttributes = [
        { type: "string", name: "name", required: false, size: 500 },
        { type: "string", name: "email", required: false, size: 500 },
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
        {
          type: "string",
          name: "categoryTags",
          required: false,
          array: true,
          size: 500,
        },
        {
          type: "string",
          name: "socials",
          required: false,
          array: true,
          size: 500,
        },
        { type: "string", name: "city", required: false, size: 500 },
        { type: "string", name: "address", required: false, size: 500 },
        { type: "string", name: "country", required: false, size: 100 },
        { type: "string", name: "userId", required: true, size: 500 },
      ];

      // Create the company collection
      const collection = await databases.createCollection(
        databaseId,
        ID.unique(),
        "company",
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ]
      );

      // Add attributes to the collection
      for (const attr of companyAttributes) {
        await databases.createStringAttribute(
          databaseId,
          collection.$id,
          attr.name,
          attr.size,
          attr.required,
          undefined,
          attr.array || false
        );
      }

      // Re-initialize collections so the new collection is available
      await initializeCollections();
      console.log("Company collection created and collections re-initialized.");
    }

    // Find the company collection
    const companyCollection = collections.find((col) => col.name === "company");

    // Initialize db.company if not done already
    if (!db.company) {
      db.company = {
        create: async (payload, id = ID.unique()) =>
          await databases.createDocument(
            databaseId,
            companyCollection.id,
            id,
            payload
          ),
      };
    }

    // Create a document in the company collection with the user's details
    const companyDocumentPayload = { ...companyData, userId };
    await db.company.create(companyDocumentPayload, ID.unique());

    console.log("Company document created successfully.");
  } catch (error) {
    console.error("Error creating company collection or document:", error);
    throw error;
  }
};

// Function to create a JobSeeker collection and insert a document
export const createJobSeekerCollectionAndDocument = async (
  userId,
  jobSeekerData
) => {
  try {
    const existingCollections = await databases.listCollections(databaseId);
    const jobSeekerCollectionExists = existingCollections.collections.some(
      (collection) => collection.name === "JobSeekers"
    );

    if (!jobSeekerCollectionExists) {
      const jobSeekerAttributes = [
        { type: "string", name: "userId", required: true, size: 500 },
        { type: "string", name: "profileImg", required: false, size: 500 },
        { type: "string", name: "name", required: false, size: 500 },
        { type: "string", name: "jobTitle", required: false, size: 500 },
        { type: "string", name: "country", required: false, size: 500 },
        { type: "string", name: "city", required: false, size: 500 },
        {
          type: "string",
          name: "expectedSalaryRange",
          required: false,
          size: 100,
        },
        { type: "datetime", name: "registerTime", required: false },
        {
          type: "string",
          name: "categoryTags",
          required: false,
          array: false,
          size: 500,
        },
        { type: "string", name: "cv", required: false, size: 1000 },
        {
          type: "integer",
          name: "experience",
          min: 0,
          max: 150,
          required: false,
        },
        { type: "integer", name: "age", min: 0, max: 150, required: false },
        { type: "string", name: "gender", required: false, size: 100 },
        { type: "string", name: "languages", required: false, size: 500 },
        {
          type: "string",
          name: "educationalLevel",
          required: false,
          size: 500,
        },
        { type: "url", name: "linkedin", required: false },
        { type: "url", name: "github", required: false },
        { type: "url", name: "twitter", required: false },
        {
          type: "string",
          name: "skills",
          required: false,
          array: false,
          size: 500,
        },
        { type: "string", name: "video", required: false, size: 1000 },
        { type: "string", name: "description", required: false, size: 1000 },
      ];

      await db.createCollection("JobSeekers", jobSeekerAttributes);

      // Re-initialize collections so the new collection is available
      await initializeCollections();
    }

    const jobSeekerCollection = collections.find(
      (col) => col.name === "JobSeekers"
    );
    if (!db.JobSeekers) {
      db.JobSeekers = {
        create: async (payload, id = ID.unique()) =>
          await databases.createDocument(
            databaseId,
            jobSeekerCollection.id,
            id,
            payload
          ),
      };
    }

    const jobSeekerDocumentPayload = { ...jobSeekerData, userId };
    await db.JobSeekers.create(jobSeekerDocumentPayload, ID.unique());
  } catch (error) {
    console.error("Error creating JobSeeker collection or document:", error);
    throw error;
  }
};

// Function to fetch all teams
export const fetchTeams = async () => {
  try {
    // Use the teams.list() method to get all teams
    const response = await teams.list();

    // Return the list of teams
    return response.teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

// Example of how to use the fetchTeams function
fetchTeams()
  .then((teamList) => {
    console.log("Teams fetched successfully:", teamList);
  })
  .catch((error) => {
    console.error("Error fetching teams:", error);
  });
