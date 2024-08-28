import { databases, databaseId } from "./config";

// Function to fetch all collections from Appwrite
export const fetchAllCollections = async () => {
  try {
    const result = await databases.listCollections(databaseId);
    const collections = result.collections.map((collection) => ({
      id: collection.$id,
      name: collection.name,
    }));
    console.log(
      "All collections fetched and formatted successfully:",
      collections
    );
    return collections;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

// Ensure collections are fetched by returning them
export const initializeCollections = async () => {
  return await fetchAllCollections();
};