import * as sdk from "node-appwrite";
import { account, companiesTeamId, jobSeekersTeamId, teams } from "../config";

import {
  createCompanyCollectionAndDocument,
  createJobSeekerCollectionAndDocument,
} from "@/global-functions/functions";
import { ID } from "appwrite";
// Function to register a new user and automatically assign to a team
export async function registerUser(
  email,
  password,
  isEmployer,
  profileData = {}
) {
  try {
    // Step 1: Register the user
    const user = await account.create(ID.unique(), email, password);
    localStorage.setItem("authToken", user.$id);

    // Step 2: Authenticate the user (log in to create a session)
    await account.createEmailPasswordSession(email, password);

    // Step 3: Assign the user to a team
    await assignUserToTeam(user.$id, email, isEmployer);

    // Step 4: If the user is an employer, create the company collection and document, otherwise create JobSeeker collection
    if (isEmployer) {
      await createCompanyCollectionAndDocument(user.$id, profileData);
    } else {
      await createJobSeekerCollectionAndDocument(user.$id, profileData);
    }

    return user;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

// Function to sign in the user by email and password, return user details and team membership
export const signIn = async (email, password) => {
  try {
    // Step 1: Authenticate the user (create a session)
    const session = await account.createEmailPasswordSession(email, password);
    localStorage.setItem("authToken", session.$id); // Store the session ID

    // Step 2: Extract user ID from session
    const userId = session.userId; // Ensure this is correct
    console.log("User ID:", userId);

    // Step 3: Define a helper function to check if the user is in a team
    // Helper function to check if the user is in a team (handles pagination)
    // Helper function to check if the user is in a team (handles pagination)
    const isUserInTeam = async (teamId) => {
      let isInTeam = false;
      let page = 0; // Initialize the page number
      const limit = 25; // Default limit per request

      try {
        while (true) {
          

          // Fetch the list of memberships with pagination
          const response = await teams.listMemberships(teamId, [
            sdk.Query.limit(limit),
            sdk.Query.offset(page * limit),
          ]);

          const memberships = response.memberships;

          // Check if the user is in the current batch of memberships
          if (memberships.some((membership) => membership.userId === userId)) {
            isInTeam = true;
            break; // Stop further requests if user is found
          }

          // If there are fewer memberships than the limit, we've reached the end
          if (memberships.length < limit) {
            break;
          }

          // Otherwise, move to the next page
          page += 1;
        }
      } catch (error) {
        console.error(`Error fetching memberships for team ${teamId}:`, error);
      }

      return isInTeam;
    };

    //Step 4: Check if the user is in the job seekers team
    const isInJobSeekersTeam = await isUserInTeam(jobSeekersTeamId);
    if (isInJobSeekersTeam) {
      return {
        session,
        userId,
        team: "jobSeekers",
      };
    }

    // Step 5: Check if the user is in the companies team
    const isInCompaniesTeam = await isUserInTeam(companiesTeamId);
    if (isInCompaniesTeam) {
      return {
        session,
        userId,
        team: "companies",
      };
    }

    // If the user is not in any team, return null or appropriate response
    return {
      session,
      userId,
      team: null,
    };
  } catch (error) {
    console.error("Login error:", error); // Log the error details
    throw error;
  }
};
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
