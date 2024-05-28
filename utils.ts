import Jimp from "jimp";
import sharp from "sharp";
import axios from "axios";

export const generatePlaceholder = async (
  imageUrl: string
): Promise<string> => {
  try {
    // Fetch the image data from the URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const imageBuffer = Buffer.from(response.data);

    // Use sharp to read and convert the image to a format that Jimp can handle
    const convertedBuffer = await sharp(imageBuffer)
      .toFormat("jpeg")
      .toBuffer();

    // Load the converted image buffer into Jimp
    const image = await Jimp.read(convertedBuffer);

    // Resize the image to a low resolution for the placeholder
    image.resize(10, 10);

    // Convert the resized image to a base64-encoded string
    const base64 = await image.getBase64Async(Jimp.MIME_JPEG);

    return base64;
  } catch (error) {
    console.error("Error generating placeholder:", error);
    throw new Error("Failed to generate image placeholder");
  }
};
