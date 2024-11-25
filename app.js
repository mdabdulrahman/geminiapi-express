import express from "express";
import { PORT , TELEGRAM_INFORMER_API_KEY, CHAT_ID} from "./Configs.js";
import { upload, getFileParts } from "./uploadHandler.js";
import { model } from "./GoogleAI.js";
import cors from "cors";
import axios from "axios";
import { removeAllFiles } from "./deleteFiles.js";
const app = express();

const textprompt =
  "Provide a JSON strictly in this format:{invoices:[{invoice_no:null,customer_name:null,customer_ph_no:null,total_amount:null,tax:null,date:null,products:[{product_name:null,qty:null,tax:null,unit_price:null,amount:null,discount:null}]}]files_count:}, setting missing values to null; tax should be in percentage;date should be in DD-MM-YYYY format;respond ONLY with valid JSON, no extra text, explanations, or comments.combine all given files details !!! don't neglect single file !!! .Invalid responses will break my app's functionality so please";

app.use(
  cors({
    origin: "https://automated-invoice-extraction.vercel.app",
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* app.get("/", (req, res) => {
  res.sendFile("F:/geminiapi/index.html");
});
 */
app.post("/upload", upload.array("files", 10), (req, res) => {
  console.log("Got Request!");
  
   //used to notify me that this API Got a request via telegram bot
   axios.get(`https://api.telegram.org/bot${TELEGRAM_INFORMER_API_KEY}/sendMessage`+`?chat_id=${CHAT_ID}&text=Got a request!`);

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
