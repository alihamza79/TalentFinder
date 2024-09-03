import { storage } from "../config";
import { ID, Permission, Role } from "appwrite";

let createdBuckets = {}; // Cache for created buckets

const requiredBuckets = [
  {
    name: "images",
    attributes: {
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
      allowedFileTypes: ["jpg", "jpeg", "png", "gif"],
    },
  },
  {
    name: "files",
    attributes: {
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedFileTypes: ["pdf", "doc", "docx", "txt"],
    },
  },
  {
    name: "videos",
    attributes: {
      fileSizeLimit: 20 * 1024 * 1024, // 20MB
      allowedFileTypes: ["mp4", "mov", "avi"],
    },
  },
];

const createBucketIfNotExists = async (bucketName, attributes) => {
  if (createdBuckets[bucketName]) {
    console.log(`Bucket already exists in cache: ${bucketName}`);
    return createdBuckets[bucketName];
  }

  try {
    // Fetch all buckets once
    if (!createdBuckets.bucketsList) {
      createdBuckets.bucketsList = await storage.listBuckets();
    }

    // Check if the bucket already exists
    const bucketExists = createdBuckets.bucketsList.buckets.some(
      (bucket) => bucket.name === bucketName
    );

    if (!bucketExists) {
      console.log(`Creating new bucket: ${bucketName}`);

      // Lock this bucket creation to prevent race conditions
      createdBuckets[bucketName] = new Promise(async (resolve, reject) => {
        try {
          const bucket = await storage.createBucket(
            ID.unique(), // bucketId
            bucketName, // name
            [
              Permission.read(Role.any()),
              Permission.create(Role.any()),
              Permission.update(Role.any()),
              Permission.delete(Role.any()),
            ], // permissions
            true, // fileSecurity
            true, // enabled
            attributes.fileSizeLimit, // maximumFileSize
            attributes.allowedFileTypes, // allowedFileExtensions
            undefined, // compression (if not used, can be omitted or set to undefined)
            true, // encryption
            true // antivirus
          );
          console.log(`Bucket created: ${bucketName}`);
          createdBuckets.bucketsList.buckets.push(bucket); // Add to list to avoid future duplication
          resolve(bucket);
        } catch (error) {
          reject(error);
        }
      });

      return await createdBuckets[bucketName];
    } else {
      console.log(createdBuckets);
      console.log(`Bucket already exists: ${bucketName}`);
      const existingBucket = createdBuckets.bucketsList.buckets.find(
        (bucket) => bucket.name === bucketName
      );
      createdBuckets[bucketName] = existingBucket;
      return existingBucket;
    }
  } catch (error) {
    console.error(`Error creating or fetching bucket ${bucketName}:`, error);
    throw error;
  }
};

// Initialize storage services
const fetchAllBuckets = async () => {
  try {
    const storageServices = {};

    for (const bucketConfig of requiredBuckets) {
      const bucket = await createBucketIfNotExists(
        bucketConfig.name,
        bucketConfig.attributes
      );

      storageServices[bucketConfig.name] = {
        bucketId: bucket.$id,
        createFile: async (file, id = ID.unique()) =>
          await storage.createFile(bucket.$id, id, file),
        deleteFile: async (fileId) =>
          await storage.deleteFile(bucket.$id, fileId),
        getFile: async (fileId) => await storage.getFile(bucket.$id, fileId),
        getFileDownload: async (fileId) =>
          await storage.getFileDownload(bucket.$id, fileId),
        listFiles: async (queries) =>
          await storage.listFiles(bucket.$id, queries),
      };
    }

    return storageServices;
  } catch (error) {
    console.error("Error initializing storage services:", error);
    throw error;
  }
};

// Ensure buckets are fetched by returning a promise
export const initializeStorageServices = async () => {
  return await fetchAllBuckets();
};
