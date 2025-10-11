import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { deleteUser, upsertUser } from "@/features/users/db";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const clerkData = event.data;

        const email = clerkData.email_addresses?.find(
          (email) => email.id === clerkData.primary_email_address_id
        )?.email_address;

        if (!email) {
          return new Response("No primary email found", { status: 400 });
        }

        await upsertUser({
          id: clerkData.id,
          email,
          name: `${clerkData.first_name} ${clerkData.last_name}`,
          imageUrl: clerkData.image_url,
          createdAt: new Date(clerkData.created_at),
          updatedAt: new Date(clerkData.updated_at),
        });

        console.log({ email });

        break;
      }
      case "user.deleted": {
        const userId = event.data.id;
        if (!userId) {
          return new Response("No user ID found", { status: 400 });
        }
        await deleteUser(userId);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.log({ e });
    return new Response("Invalid webhook", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}
