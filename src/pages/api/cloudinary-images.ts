import type { APIRoute } from "astro";
import { v2 as c } from "cloudinary";
import "dotenv/config";

c.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("missing Cloudinary configuration in environment variables");
}

export const GET: APIRoute = async () => {
  try {
    const res = await c.api.resources({
      type: "upload",
      max_results: 30,
    });

    return new Response(JSON.stringify(res.resources), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.error("error while fetching images", err);
    return new Response(JSON.stringify({ error: "failed to fetch images" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
