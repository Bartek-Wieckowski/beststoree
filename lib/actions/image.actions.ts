"use server";

import { UTApi } from "uploadthing/server";
import { formatError, formatErrorMessage } from "../utils";

// Delete images from uploadthing
export const deleteImages = async (images: string[] | string) => {
  const utapi = new UTApi();

  try {
    await utapi.deleteFiles(images);
    return { success: true, message: "Image(s) deleted successfully" };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
};
