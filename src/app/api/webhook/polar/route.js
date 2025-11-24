// api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onSubscriptionActive: async (payload) => {
    console.log("Sub Active");
    console.log(payload);
  },
  onSubscriptionCreated: async (payload) => {
    console.log("Sub created");
    console.log(payload);
  },
  onSubscriptionCanceled: async (payload) => {
    console.log("Sub cancelled");
    console.log(payload);
  },
});
