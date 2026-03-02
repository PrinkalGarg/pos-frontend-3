import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoicePDF = (invoiceData) => {
  const doc = new jsPDF();

  //////////////////////////////////////////////////////
  // CALCULATED TOTALS
  //////////////////////////////////////////////////////
  const subtotal = invoiceData.subtotal;
  const taxAmount = invoiceData.taxAmount;
  const grandTotal = invoiceData.grandTotal;

  const totalPaid = invoiceData.payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const balance = grandTotal - totalPaid;

  //////////////////////////////////////////////////////
  // HEADER
  //////////////////////////////////////////////////////
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.setFont(undefined, "bold");
  doc.text(invoiceData.store.name, 20, 20);

  doc.setFontSize(18);
  doc.setTextColor(33, 33, 33);
  doc.text("TAX INVOICE", 20, 35);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.setFont(undefined, "normal");
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 140, 20);

  const invoiceDate = new Date(invoiceData.createdAt);
  doc.text(`Date: ${invoiceDate.toLocaleDateString()}`, 140, 30);
  doc.text(`Time: ${invoiceDate.toLocaleTimeString()}`, 140, 37);
  doc.text(`Cashier: ${invoiceData.createdBy.name}`, 140, 44);

  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(invoiceData.store.address, 20, 45);
  doc.text(`Store Code: ${invoiceData.store.storeCode}`, 20, 52);

  //////////////////////////////////////////////////////
  // WATERMARK
  //////////////////////////////////////////////////////
  if (invoiceData.paymentStatus === "PAID") {
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setFont(undefined, "bold");
    doc.text("PAID", 105, 150, { align: "center", angle: 45 });

    doc.setTextColor(0);
    doc.setFont(undefined, "normal");
  }

  //////////////////////////////////////////////////////
  // CUSTOMER SECTION
  //////////////////////////////////////////////////////
  let yPos = 65;

  doc.setFillColor(249, 250, 251);
  doc.rect(20, yPos - 5, 170, invoiceData.customer ? 30 : 15, "F");

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Bill To:", 22, yPos);

  doc.setFont(undefined, "normal");

  if (invoiceData.customer) {
    doc.text(invoiceData.customer.name || "N/A", 22, yPos + 7);
    doc.text(`Phone: ${invoiceData.customer.phone || "N/A"}`, 22, yPos + 14);

    if (invoiceData.customer.email || invoiceData.customer.gstNumber) {
      doc.text(
        invoiceData.customer.email ||
          `GST: ${invoiceData.customer.gstNumber}`,
        22,
        yPos + 21
      );
      yPos += 30;
    } else {
      yPos += 20;
    }
  } else {
    doc.text("Walk-in Customer", 22, yPos + 7);
    yPos += 15;
  }

  //////////////////////////////////////////////////////
  // ITEMS TABLE
  //////////////////////////////////////////////////////
  autoTable(doc, {
    startY: yPos + 5,
    head: [["Product", "Price", "Qty", "GST%", "Tax", "Total"]],
    body: invoiceData.items.map((item) => [
      item.productName,
      `Rs. ${item.price.toFixed(2)}`,
      item.qty.toString(),
      `${item.gstRate}%`,
      `Rs. ${item.taxAmount.toFixed(2)}`,
      `Rs. ${item.total.toFixed(2)}`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 25, halign: "right" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 25, halign: "right" },
      5: { cellWidth: 25, halign: "right" },
    },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
  });

  //////////////////////////////////////////////////////
  // DYNAMIC Y TRACKING
  //////////////////////////////////////////////////////
  let currentY = doc.lastAutoTable.finalY + 15;

  //////////////////////////////////////////////////////
  // PAGE BREAK IF NEEDED
  //////////////////////////////////////////////////////
  if (currentY + 100 > doc.internal.pageSize.height) {
    doc.addPage();
    currentY = 30;
  }

  //////////////////////////////////////////////////////
  // SUMMARY SECTION
  //////////////////////////////////////////////////////
  doc.setFillColor(249, 250, 251);
  doc.rect(120, currentY, 70, 45, "F");
  doc.setDrawColor(200);
  doc.rect(120, currentY, 70, 45, "S");

  let summaryY = currentY + 10;

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  doc.text("Subtotal:", 125, summaryY);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, 180, summaryY, { align: "right" });

  summaryY += 10;
  doc.text("Tax Amount:", 125, summaryY);
  doc.text(`Rs. ${taxAmount.toFixed(2)}`, 180, summaryY, { align: "right" });

  summaryY += 10;
  doc.setFont(undefined, "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("Grand Total:", 125, summaryY);
  doc.text(`Rs. ${grandTotal.toFixed(2)}`, 180, summaryY, { align: "right" });

  //////////////////////////////////////////////////////
  // PAYMENT SECTION (ALWAYS BELOW SUMMARY)
  //////////////////////////////////////////////////////
  currentY += 60;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0);
  doc.text("Payment Details", 20, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Mode", "Amount", "Reference", "Date"]],
    body: invoiceData.payments.map((p) => [
      p.mode,
      `Rs. ${p.amount.toFixed(2)}`,
      p.reference || "-",
      new Date(p.createdAt).toLocaleDateString(),
    ]),
    foot: [
      ["Total Paid:", `Rs. ${totalPaid.toFixed(2)}`, "", ""],
      [
        balance > 0
          ? "Balance Due:"
          : balance < 0
          ? "Change:"
          : "Balance:",
        `Rs. ${Math.abs(balance).toFixed(2)}`,
        "",
        "",
      ],
    ],
    theme: "plain",
    headStyles: { fillColor: [75, 85, 99], textColor: 255, fontSize: 9 },
    footStyles: { fillColor: [243, 244, 246], fontStyle: "bold", fontSize: 9 },
    columnStyles: { 1: { halign: "right" }, 3: { halign: "center" } },
    margin: { left: 20 },
  });

  //////////////////////////////////////////////////////
  // STATUS
  //////////////////////////////////////////////////////
  const statusY = doc.lastAutoTable.finalY + 10;

  let statusColor = [6, 95, 70];
  let statusBg = [209, 250, 229];

  if (invoiceData.paymentStatus === "PARTIAL") {
    statusColor = [146, 64, 14];
    statusBg = [254, 243, 199];
  } else if (invoiceData.paymentStatus !== "PAID") {
    statusColor = [153, 27, 27];
    statusBg = [254, 226, 226];
  }

  doc.setFillColor(...statusBg);
  doc.rect(20, statusY - 3, 50, 10, "F");

  doc.setFontSize(9);
  doc.setTextColor(...statusColor);
  doc.setFont(undefined, "bold");
  doc.text(`Status: ${invoiceData.paymentStatus}`, 25, statusY + 2);

  //////////////////////////////////////////////////////
  // FOOTER
  //////////////////////////////////////////////////////
  const footerY = doc.internal.pageSize.height - 20;

  doc.setDrawColor(200);
  doc.line(20, footerY - 5, 190, footerY - 5);

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.setFont(undefined, "normal");
  doc.text("Thank you for your business!", 105, footerY, { align: "center" });
  doc.text("This is a computer generated invoice", 105, footerY + 5, {
    align: "center",
  });

  doc.setFontSize(7);
  doc.text(
    "Terms: Goods once sold will not be taken back or exchanged",
    20,
    footerY + 12
  );

  //////////////////////////////////////////////////////
  // SAVE
  //////////////////////////////////////////////////////
  doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
};

export default generateInvoicePDF;