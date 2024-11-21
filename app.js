import express from "express";
import { PORT } from "./Configs.js";
import { upload, getFileParts } from "./uploadHandler.js";
import { model } from "./GoogleAI.js";
import cors from "cors";
import { removeAllFiles } from "./deleteFiles.js";
const app = express();

const textprompt =
  "combine all files details into one json like this {invoices:[{invoice_no:,customer_name:,total_amount:,tax:,date:,products:[{product_name:,qty:, tax:,unit_price:,amount:,discount:,}...]}],products:[{product_name:,qty:,unit_price:,tax:,amount:,discount:,}...]customers:[{cust_name:,ph_no:,tot_amount:}]}, i don't need any additional texts only data if you didn't received any file then just reply with []";
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
