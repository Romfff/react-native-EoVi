import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("✅ CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("✅ API KEY:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing");
export default cloudinary;
