import { serve } from "inngest/next";
import { helloWorld } from "@/inngest/functions";
import { inngest } from "@/inngest/client"; // Note: import the instance, not the class

export const { GET, POST, PUT } = serve({
  client: inngest, // Use the imported instance
  functions: [helloWorld],
});