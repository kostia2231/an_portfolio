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
  throw new Error("missing cloudinary configuration in environment variables");
}

export const GET: APIRoute = async (request) => {
  try {
    const url = new URL(request.url);
    const nextCursor = url.searchParams.get("next_cursor");
    const maxResults = 25;

    const res = await c.api.resources({
      type: "upload",
      max_results: maxResults,
      next_cursor: nextCursor || null,
    });

    const resources = res.resources.map((image: { secure_url: string }) => ({
      ...image,
      transformed_url: image.secure_url.replace(
        "/upload/",
        "/upload/w_1000/q_auto/f_auto/",
      ),
    }));

    console.log(resources);

    return new Response(
      JSON.stringify({
        resources,
        next_cursor: res.next_cursor,
      }),

      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (err) {
    console.error("error while fetching images", err);
    return new Response(JSON.stringify({ error: "failed to fetch images" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
