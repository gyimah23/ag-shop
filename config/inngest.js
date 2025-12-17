import { Inngest } from "inngest";
import connectDB from "./db"
import user from "@/models/User"

// Create a client to send and receive events
export const inngest = new Inngest({ id: "agtech" });

// inngest function to save user data to a database
export const syncUsercreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {event:'clerk/user.created'},
    async({event}) =>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name:`${first_name} ${last_name}`,
            imageUrl:image_url
            
        }
        await connectDB();
        await user.create(userData);
    }
)

// inmgest function to update user database
export const syncUpdation = inngest.createFunction(
    {
        id:'sync-updation-from-clerk'   
    },
    'event:clerk/user.updated',
    async({event}) =>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name:`${first_name} ${last_name}`,
            imageUrl:image_url
        }
        await connectDB();
        await user.findByIdAndUpdate(id,userData);
    }
)

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id:'sync-deletion-with-clerk'   
    },
    {event:'clerk/user.deleted'},
    async({event}) =>{
        const {id}=event.data
        await connectDB();
        await user.findByIdAndDelete(id);
    }

)