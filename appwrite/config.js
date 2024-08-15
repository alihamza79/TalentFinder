import { Client, Account, Databases, Storage } from "appwrite";

// Access environment variables
const Endpoint = "https://cloud.appwrite.io/v1";
const projectID = "66bd29c400097874f435";
const databaseId = "66bd2c660034d08a4030";



const client = new Client();

client
  .setEndpoint(Endpoint) // Your Appwrite Endpoint
  .setProject(projectID); // Your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { databaseId,projectID };
