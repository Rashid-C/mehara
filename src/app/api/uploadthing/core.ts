import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    return {
      url: file.ufsUrl,
      name: file.name,
    };
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
