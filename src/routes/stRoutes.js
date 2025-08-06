import express from "express"
import cloudinary from "../lib/cloudinary.js"
import St from "../models/St.js"
import protectRoute from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    console.log("📥 Incoming data:", { title, caption, rating, imageLength: image?.length });

    if (!title || !caption || !rating) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (!image) {
      return res.status(400).json({ message: "Please provide an image" });
    }

    console.log("🔑 User from protectRoute:", req.user);

    // Upload Cloudinary
    console.log("🚀 Uploading image to Cloudinary...");
    const uploadResponse = await cloudinary.uploader.upload(image);
    console.log("✅ Cloudinary uploaded:", uploadResponse.secure_url);

    const newSt = new St({
      title,
      caption,
      rating,
      image: uploadResponse.secure_url,
      user: req.user._id,
    });

    await newSt.save();
    console.log("✅ New St saved:", newSt._id);

    res.status(201).json(newSt);
  } catch (error) {
    console.error("❌ Error creating St:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

router.get("/", protectRoute, async(req,res)=>{
    try{
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit

        const sts=await St.find()
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage")

        const totalSts= await St.countDocuments()

        res.send(
        {
            sts,
            currentPage: page,
            totalSts,
            totalPage: Math.ceil(totalSts / limit)
        }
        )

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

router.delete("/:id", protectRoute, async(req, res)=> {
    try{
        const st= await St.findById(req.params.id)
        if(!st) return res.status(404).json({message:"something not found"});

        if(st.user.toString() !== req.user._id.toString())
        {
            return res.status(401).json({message:"Unauthorized"})      
        }
        if (st.image && st.image.includes("cloudinary"))
        {
            try{
                const publicId= st.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId)
            }
            catch(deleteError){
                console.log(deleteError)
            }
        }
        await st.deleteOne()

        res.json({message:"Deleted succesfully"})
    }
    catch(error){
        console.log(error)

    }

})
export default router
