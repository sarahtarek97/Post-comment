const fs = require("fs");
const PDFDocument = require("pdfkit");
const User = require("../model/user.model");

async function createInvoice(user, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc,user);
  generateInvoiceTable(doc, user);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc,user) {
 let image =user.profileImg.split('3000')[1];
    //display image in pdf
  doc
    .image(`.${image}`, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text(`${user.userName}`, 110, 57)
    .fontSize(10)
    .text(`${user.userName}`, 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

function generateInvoiceTable(doc, user) {
    let i=0;
    const invoiceTableTop = 300;

  doc.font("Helvetica-Bold");

  generateTableRow(
    doc,
    invoiceTableTop,
    "Name",
    "Email",
    "Role",
    "Age",
    "Verified"
    
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      user.userName,
      user.email,
      user.role,
      user.age,
      user.verified
    );

    generateHr(doc, position + 20);

}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "This your profile",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}


module.exports = {
  createInvoice
};