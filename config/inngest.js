import { Inngest } from "inngest";
import dbConnect from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "agtech" });

// inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        event: "clerk/user.created",
    },
    async ({ event }) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                _id: id,
                email: email_addresses?.[0]?.email_address || "",
                name: `${first_name} ${last_name}`,
                imageUrl: image_url,
            };

            await dbConnect();
            await User.create(userData);
        } catch (err) {
            console.error("syncUserCreation error:", err);
            throw err;
        }
    }
);

// inngest function to update user database
export const syncUpdation = inngest.createFunction(
    {
        id: "sync-updation-from-clerk",
        event: "clerk/user.updated",
    },
    async ({ event }) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                _id: id,
                email: email_addresses?.[0]?.email_address || "",
                name: `${first_name} ${last_name}`,
                imageUrl: image_url,
            };

            await dbConnect();
            await User.findByIdAndUpdate(id, userData, { upsert: true, new: true });
        } catch (err) {
            console.error("syncUpdation error:", err);
            throw err;
        }
    }
);

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "sync-deletion-with-clerk",
        event: "clerk/user.deleted",
    },
    async ({ event }) => {
        try {
            const { id } = event.data;
            await dbConnect();
            await User.findByIdAndDelete(id);
        } catch (err) {
            console.error("syncUserDeletion error:", err);
            throw err;
        }
    }
);