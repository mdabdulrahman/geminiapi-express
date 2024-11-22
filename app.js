import express from "express";
import { PORT } from "./Configs.js";
import { upload, getFileParts } from "./uploadHandler.js";
import { model } from "./GoogleAI.js";
import cors from "cors";
import { removeAllFiles } from "./deleteFiles.js";
const app = express();

const textprompt =
  "Provide a JSON strictly in this format:{invoices:[{invoice_no:null,customer_name:null,customer_ph_no:null,total_amount:null,tax:null,date:null,products:[{product_name:null,qty:null,tax:null,unit_price:null,amount:null,discount:null}]}]}, setting missing values to null; respond ONLY with valid JSON, no extra text, explanations, or comments. Invalid responses will break my app's functionality so please";
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
