import sharp from "sharp";
import type { FormatEnum } from "sharp";

// declare possible conversions
export const properties = {
  from: { images: ["jpeg", "png", "webp", "gif", "avif", "tiff", "svg"] },
  to: { images: ["jpeg", "png", "webp", "gif", "avif", "tiff"] },
  options: {
    svg: {
      scale: {
        description: "Scale the image up or down",
        type: "number",
        default: 1,
      },
    },
  },
};

export async function convert(
  filePath: string,
  fileType: string,
  convertTo: keyof FormatEnum,
  targetPath: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  options?: any,
) {
  if (fileType === "svg") {
    const scale = options.scale || 1;
    const metadata = await sharp(filePath).metadata();

    if (!metadata || !metadata.width || !metadata.height) {
      throw new Error("Could not get metadata from image");
    }

    const newWidth = Math.round(metadata.width * scale);
    const newHeight = Math.round(metadata.height * scale);

    return await sharp(filePath)
      .resize(newWidth, newHeight)
      .toFormat(convertTo)
      .toFile(targetPath);
  }

  return await sharp(filePath).toFormat(convertTo).toFile(targetPath);
}