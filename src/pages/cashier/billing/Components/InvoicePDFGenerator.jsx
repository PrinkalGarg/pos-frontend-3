import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InvoicePDFGenerator = ({ invoiceData, onClose }) => {
  const [loading, setLoading] = React.useState(false);

  const generateAdvancedPDF = () => {
    try {
      setLoading(true);
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // ========== HEADER SECTION ==========
      // Store Logo/Name
      doc.setFontSize(24);
      doc.setTextColor(37, 99, 235); // Blue color
      doc.text(invoiceData.invoice.store.name, 20, 20);
      
      // Invoice Title
      doc.setFontSize(18);
      doc.setTextColor(33, 33, 33); // Dark gray
      doc.text('TAX INVOICE', 20, 35);
      
      // Invoice Number
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: ${invoiceData.invoice.invoiceNumber}`, 140, 20);
      
      // Store Details
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(invoiceData.invoice.store.address, 20, 45);
      doc.text(`Store Code: ${invoiceData.invoice.store.storeCode}`, 20, 52);
      
      // Date and Time
      const invoiceDate = new Date(invoiceData.invoice.createdAt);
      doc.text(`Date: ${invoiceDate.toLocaleDateString()}`, 140, 30);
      doc.text(`Time: ${invoiceDate.toLocaleTimeString()}`, 140, 37);
      doc.text(`Cashier: ${invoiceData.invoice.createdBy.name}`, 140, 44);
      
      // ========== CUSTOMER SECTION ==========
      let yPos = 65;
      
      // Customer section background
      doc.setFillColor(249, 250, 251); // Light gray
      doc.rect(20, yPos - 5, 170, invoiceData.invoice.customer ? 30 : 15, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(33, 33, 33);
      doc.setFont(undefined, 'bold');
      doc.text('Bill To:', 22, yPos);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(80, 80, 80);
      
      if (invoiceData.invoice.customer) {
        doc.text(invoiceData.invoice.customer.name || 'N/A', 22, yPos + 7);
        doc.text(`Phone: ${invoiceData.invoice.customer.phone || 'N/A'}`, 22, yPos + 14);
        
        if (invoiceData.invoice.customer.email || invoiceData.invoice.customer.gstNumber) {
          doc.text(
            invoiceData.invoice.customer.email || `GST: ${invoiceData.invoice.customer.gstNumber}`,
            22,
            yPos + 21
          );
          yPos += 30;
        } else {
          yPos += 20;
        }
      } else {
        doc.text('Walk-in Customer', 22, yPos + 7);
        yPos += 15;
      }
      
      // ========== ITEMS TABLE ==========
      // Table headers
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Product', 'Price', 'Qty', 'GST%', 'Tax', 'Total']],
        body: invoiceData.invoice.items.map(item => [
          item.productName,
          `Rs. ${item.price.toFixed(2)}`,
          item.qty.toString(),
          `${item.gstRate}%`,
          `Rs. ${item.taxAmount.toFixed(2)}`,
          `Rs. ${item.total.toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 25, halign: 'right' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 25, halign: 'right' }
        },
        margin: { left: 20, right: 20 },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        }
      });
      
      // ========== SUMMARY SECTION ==========
      const finalY = doc.lastAutoTable.finalY + 10;
      
      // Summary box
      doc.setFillColor(249, 250, 251);
      doc.rect(120, finalY, 70, 45, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(120, finalY, 70, 45, 'S');
      
      // Summary content
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      
      let summaryY = finalY + 7;
      
      doc.text('Subtotal:', 125, summaryY);
      doc.text(`Rs. ${invoiceData.totals.subtotal.toFixed(2)}`, 180, summaryY, { align: 'right' });
      
      summaryY += 8;
      doc.text('Tax Amount:', 125, summaryY);
      doc.text(`Rs. ${invoiceData.totals.taxAmount.toFixed(2)}`, 180, summaryY, { align: 'right' });
      
      summaryY += 8;
      doc.setFont(undefined, 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Grand Total:', 125, summaryY);
      doc.text(`Rs. ${invoiceData.totals.grandTotal.toFixed(2)}`, 180, summaryY, { align: 'right' });
      
      // ========== PAYMENT SECTION ==========
      const paymentY = finalY + 55;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(33, 33, 33);
      doc.text('Payment Details', 20, paymentY);
      
      // Payment table
      autoTable(doc, {
        startY: paymentY + 5,
        head: [['Mode', 'Amount', 'Reference', 'Date']],
        body: invoiceData.invoice.payments.map(p => [
          p.mode,
          `Rs. ${p.amount.toFixed(2)}`,
          p.reference || '-',
          new Date(p.createdAt).toLocaleDateString()
        ]),
        foot: [
          [
            'Total Paid:',
            `Rs. ${invoiceData.totals.totalPaid.toFixed(2)}`,
            '',
            ''
          ],
          [
            invoiceData.totals.balance > 0 ? 'Balance Due:' : invoiceData.totals.balance < 0 ? 'Change:' : 'Balance:',
            `Rs. ${Math.abs(invoiceData.totals.balance).toFixed(2)}`,
            '',
            ''
          ]
        ],
        theme: 'plain',
        headStyles: {
          fillColor: [75, 85, 99],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        footStyles: {
          fillColor: [243, 244, 246],
          textColor: [33, 33, 33],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 35, halign: 'right' },
          2: { cellWidth: 45 },
          3: { cellWidth: 40, halign: 'center' }
        },
        margin: { left: 20 }
      });
      
      // ========== PAYMENT STATUS ==========
      const statusY = doc.lastAutoTable.finalY + 10;
      
      // Status badge
      const status = invoiceData.invoice.paymentStatus;
      let statusColor;
      let statusBg;
      
      switch(status) {
        case 'PAID':
          statusColor = [6, 95, 70]; // Dark green
          statusBg = [209, 250, 229]; // Light green
          break;
        case 'PARTIAL':
          statusColor = [146, 64, 14]; // Dark orange
          statusBg = [254, 243, 199]; // Light yellow
          break;
        default:
          statusColor = [153, 27, 27]; // Dark red
          statusBg = [254, 226, 226]; // Light red
      }
      
      doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
      doc.rect(20, statusY - 3, 50, 10, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setFont(undefined, 'bold');
      doc.text(`Status: ${status}`, 25, statusY + 2);
      
      // ========== FOOTER ==========
      const footerY = doc.internal.pageSize.height - 20;
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, footerY - 5, 190, footerY - 5);
      
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.setFont(undefined, 'normal');
      doc.text('Thank you for your business!', 105, footerY, { align: 'center' });
      doc.text('This is a computer generated invoice', 105, footerY + 5, { align: 'center' });
      
      // Terms and conditions
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      doc.text('Terms: Goods once sold will not be taken back or exchanged', 20, footerY + 12);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, footerY + 17);
      
      // ========== SAVE PDF ==========
      doc.save(`Invoice-${invoiceData.invoice.invoiceNumber}.pdf`);
      
      // Close modal after successful generation
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Generate Invoice PDF
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Invoice Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-semibold text-blue-600">
                {invoiceData.invoice.invoiceNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(invoiceData.invoice.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Grand Total:</span>
              <span className="font-bold text-lg text-green-600">
                ₹{invoiceData.totals.grandTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                invoiceData.invoice.paymentStatus === 'PAID' 
                  ? 'bg-green-100 text-green-800'
                  : invoiceData.invoice.paymentStatus === 'PARTIAL'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {invoiceData.invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="mb-6 text-sm text-gray-500">
          <p>PDF will include:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Store details and invoice information</li>
            <li>Customer details (if available)</li>
            <li>Itemized list with prices and taxes</li>
            <li>Payment summary and status</li>
            <li>Terms and conditions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generateAdvancedPDF}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              'Download PDF'
            )}
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDFGenerator;