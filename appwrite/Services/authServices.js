import { account, teams, jobSeekersTeamId, companiesTeamId } from "../config";

// Function to register a new user and automatically assign to a team
export async function registerUser(email, password, isEmployer) {
  try {
    //   // Step 1: Register the user
    const user = await account.create("unique()", email, password);
    localStorage.setItem("authToken", user.$id);

    // Step 2: Authenticate the user (log in to create a session)
    await account.createEmailPasswordSession(email, password);

    // Step 3: Assign the user to a team
    await assignUserToTeam(user.$id, email, isEmployer);
    // await assignUserToTeam("66c96885afea1a3eaf92", email, isEmployer);

    return user;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

// Function to log in the user (create a session)
export const signIn = async (email, password) => {
  try {
    // Log in the user with email and password using the correct method
    const session = await account.createEmailPasswordSession(email, password); // Correct method
    localStorage.setItem("authToken", session.$id); // Store session ID
    return session;
  } catch (error) {
    console.error("Login error:", error);
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
