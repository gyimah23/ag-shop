import { serve } from "inngest/next";
import { inngest, syncUpdation, syncUsercreation, syncUserDeletion } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    syncUsercreation,
    syncUpdation,
    syncUserDeletion
  ],
});