// import { v2 as c } from "cloudinary";
// import "dotenv/config";

// c.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);

// if (
//   !process.env.CLOUDINARY_CLOUD_NAME ||
//   !process.env.CLOUDINARY_API_KEY ||
//   !process.env.CLOUDINARY_API_SECRET
// ) {
//   throw new Error("Missing Cloudinary configuration in environment variables");
// }

// export async function handler(event: any) {
//   try {
//     const url = new URL(event.rawUrl);
//     console.log("Request URL:", event.rawUrl);

//     const nextCursor = url.searchParams.get("next_cursor");
//     const maxResults = 25;

//     const res = await c.api.resources({
//       type: "upload",
//       max_results: maxResults,
//       next_cursor: nextCursor || null,
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         resources: res.resources,
//         next_cursor: res.next_cursor,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//         "Cache-Control": "no-store",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type",
//       },
//     };
//   } catch (err) {
//     console.error("Error fetching images:", err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Failed to fetch images" }),
//       headers: { "Content-Type": "application/json" },
//     };
//   }
// }
