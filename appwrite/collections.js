import { databases, databaseId } from "./config"; // Ensure config is imported

// export let collections = [];
export let collections = [
  {
    name: 'company',
    id: '66cb27d50000439e67d7',  // Make sure this is the correct collection ID from Appwrite
  },
  {
    name: 'jobSeekers',
    id: '66cb2b3500208a24a3c5',  // Another example for jobSeekers
  },
  // Add any other collections you have
];

// Function to fetch all collections from Appwrite
export const fetchAllCollections = async () => {
  try {
    const result = await databases.listCollections(databaseId);
    collections = result.collections.map((collection) => ({
      id: collection.$id,
      name: collection.name,
    }));
    console.log("All collections fetched and formatted successfully:", collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

// Ensure collections are fetched by returning a promise
export const initializeCollections = async () => {
  await fetchAllCollections();
};
