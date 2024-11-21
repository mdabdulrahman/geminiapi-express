import express from "express";
import { PORT } from "./Configs.js";
import { upload, getFileParts } from "./uploadHandler.js";
import { model } from "./GoogleAI.js";
import cors from "cors";
import { removeAllFiles } from "./deleteFiles.js";

const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* app.get("/", (req, res) => {
  res.sendFile("F:/geminiapi/index.html");
});
 */
app.post("/upload", upload.array("files", 10), (req, res) => {
  console.log("Got Request!");

  // 'files' is the name of the input field in the HTML form,
  // and 10 is the max number of files allowed to upload
  if (!req.files) {
    return res.status(400).send("No files uploaded.");
  }

  //generate the content
  generate(getFileParts(req.files)).then((result) => {
    res.send(result);

    //delete file after processing
    //removeAllFiles("uploads");
  });
});

//to generate content using files
async function generate(fileParts) {
  const result = await model.generateContent([
    ...fileParts,
    {
      text: "first tell the names of file i send to you Give a json format of this invoice details combine these files and also how many files i given to you don't neglect single data by lazieness give it all data throughly",
    },
  ]);

  return result.response;
}
