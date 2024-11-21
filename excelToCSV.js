import XLSX from "xlsx";
import fs from "fs";
import path from "path";
// Function to convert XLS (or XLSX) file to CSV format
export function convertXLSToCSV(filePath) {
  // Read the Excel file

  try {
    const workbook = XLSX.readFile(filePath);
    const csvPaths = [];
    // Get the first sheet (you can specify a sheet by name too)
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to CSV
      const csvContent = XLSX.utils.sheet_to_csv(sheet);
      const fileName =
        path.basename(filePath, path.extname(filePath)) + sheetName + ".csv";
      fs.writeFileSync("uploads/" + fileName, csvContent);
      csvPaths.push(path.resolve("uploads", fileName));
    });

    return csvPaths;
  } catch (error) {
    console.log(error);
    return [];
  }
}
