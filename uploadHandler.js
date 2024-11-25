import multer from "multer";
import path from "path";
import fs from "fs";
import { convertXLSToCSV } from "./excelToCSV.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
   // console.log(file)
    cb(null, file.originalname); // Unique filename
  },
});

const supportedFormats = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
  "application/x-javascript",
  "text/javascript",
  "application/x-python",
  "text/x-python",
  "text/plain",
  "text/html",
  "text/css",
  "text/markdown",
  "text/csv",
  "text/xml",
  "text/rtf",
];

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
export const upload = multer({ storage: storage });

export const getFileParts = (files) => {
  let fileParts = [];
  files.forEach((file) => {
    if (!supportedFormats.includes(file.mimetype)) {
      //try it to convert to csv format
      let csvPaths = convertXLSToCSV(file.path);
      if (csvPaths.length != 0) {
        csvPaths.forEach((csvpath) =>
          fileParts.push(fileToGenerativePart(csvpath, "text/csv"))
        );
      }
    } else {
      fileParts.push(fileToGenerativePart(file.path, file.mimetype));
    }
  });
  console.log(fileParts.length)
  return fileParts;
};
