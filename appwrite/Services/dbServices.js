import { initializeCollections, collections } from "../collections";
import { databaseId, databases } from "../config";
import { ID, Permission, Role } from "appwrite";
import storageServices from "./storageServices";

// Initialize collections before using them
(async () => {
  await initializeCollections();
})();

const db = {};

// Function to create a new collection with full permissions and attributes, including array attributes
db.createCollection = async (collectionName, attributes = []) => {
  try {
    const collection = await databases.createCollection(
      databaseId,
      ID.unique(), // Unique ID for the collection
      collectionName,
      [
        Permission.read(Role.any()),      // Public read
        Permission.write(Role.any()),     // Public write
        Permission.update(Role.any()),    // Public update
        Permission.delete(Role.any())     // Public delete
      ]
    );
    console.log("Collection created successfully:", collection);

    // Loop through attributes and create them based on the type
    for (const attr of attributes) {
      switch (attr.type) {
        case 'string':
          await databases.createStringAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.size,        // Set the size of the string attribute
            attr.required,    // Required flag
            undefined,        // Default value
            attr.array || false // Is it an array?
          );
          break;
        case 'integer':
          await databases.createIntegerAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.min,         // Minimum value for integer
            attr.max,         // Maximum value for integer
            attr.required
          );
          break;
        case 'boolean':
          await databases.createBooleanAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.required
          );
          break;
        case 'float':
          await databases.createFloatAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.min,         // Minimum value for float
            attr.max,         // Maximum value for float
            attr.required
          );
          break;
        case 'enum':
          await databases.createEnumAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.elements,    // List of possible enum values
            attr.required
          );
          break;
        case 'email':
          await databases.createEmailAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.required
          );
          break;
        case 'url':
          await databases.createUrlAttribute(
            databaseId,
            collection.$id,
            attr.name,
            attr.required
          );
          break;
        default:
          console.error(`Unknown attribute type: ${attr.type}`);
      }
    }

    console.log("Attributes added successfully to collection:", collectionName);
    return collection;
  } catch (error) {
    console.error("Error creating collection or setting attributes:", error);
    throw error;
  }
};

// Initialize db services for each collection in the collections array
collections.forEach((col) => {
  db[col.name] = {
    create: async (payload, id = ID.unique()) =>
      await databases.createDocument(databaseId, col.id, id, payload),

    update: async (id, payload) =>
      await databases.updateDocument(databaseId, col.id, id, payload),

    get: async (id) => await databases.getDocument(databaseId, col.id, id),

    list: async (queries) =>
      await databases.listDocuments(databaseId, col.id, queries),

    delete: async (id) =>
      await databases.deleteDocument(databaseId, col.id, id),
  };
});

export default db;
