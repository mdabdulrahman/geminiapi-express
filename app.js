import express from "express";
import { PORT } from "./Configs.js";
import { upload, getFileParts } from "./uploadHandler.js";
import { model } from "./GoogleAI.js";
import cors from "cors";
import { removeAllFiles } from "./deleteFiles.js";
const app = express();

const textprompt =
  "give me invoice details with these details as json : Serial Number, Customer Name, product name, qty,tax, Total Amount and Date.give me product details with these details as json : Name, Quantity, Unit Price,Tax, Price with Tax (all required).give me Customers Tab with these details as json :Customer Name,Phone Number, and Total Purchase Amount.";
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
    removeAllFiles("uploads");
  });
});

//to generate content using files
async function generate(fileParts) {
  const result = await model.generateContent([
    ...fileParts,
    {
      text: textprompt,
    },
  ]);

  return result.response;
}
