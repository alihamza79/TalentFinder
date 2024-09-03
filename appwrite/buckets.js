import { storage } from "./config"; // Ensure config is imported

// Function to initialize and fetch all buckets from Appwrite
export const initializeBuckets = async () => {
  try {
    const result = await storage.listBuckets();
    const buckets = result.buckets.map((bucket) => ({
      id: bucket.$id,
      name: bucket.name,
    }));
    console.log("All buckets fetched and formatted successfully:", buckets);
    return buckets;
  } catch (error) {
    console.error("Error fetching buckets:", error);
    throw error;
  }
};

// Function to create a new storage bucket with attributes
export const createBucket = async (bucketName, attributes = {}) => {
  try {
    const {
      fileSizeLimit = null,
      allowedFileTypes = [],
      isPublic = true,
      encryption = true,
      antivirus = true,
    } = attributes;

    const bucket = await storage.createBucket(
      ID.unique(),
      bucketName,
      [
        Permission.create(Role.any()), // Public upload
        Permission.read(Role.any()), // Public download
        Permission.update(Role.any()), // Public update
        Permission.delete(Role.any()), // Public delete
      ],
      isPublic,
      fileSizeLimit,
      allowedFileTypes
    );

    // Set additional attributes
    await storage.updateBucket(bucket.$id, {
      encryption,
      antivirus,
    });

    console.log("Bucket created successfully with attributes:", bucket);
    return bucket;
  } catch (error) {
    console.error("Error creating bucket:", error);
    throw error;
  }
};
