import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config();

export default cloudinary;

export const cloudinaryUpload = async(localFilePath: string) => {
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}