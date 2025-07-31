// app/components/DownloadPDFButton.tsx
"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "./ui/button";
import { Company } from "@prisma/client";

interface DownloadPDFButtonProps {
  content: React.ReactNode; // Accept JSX like <InvoiceContent />
  filename?: string;
}

export default function DownloadPDFButton({
  content,
  filename = "invoice.pdf",
}: DownloadPDFButtonProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  };

  return (
    <>
      <Button onClick={generatePDF}>
        <Printer />
        Print
      </Button>

      {/* Hidden content to be printed */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        {content}
      </div>
    </>
  );
}

interface InvoiceProps {
  orderId: string;
  company?: Company | null;
  notes?: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  orderItems: {
    product: {
      name: string;
      hsnCode?: string;
      unit: string;
      size?: string;
    };
    quantity: number;
    price: number;
  }[];
  date: string;
}

export function InvoiceContent({
  orderId,
  customer,
  notes,
  company,
  orderItems,
  date,
}: InvoiceProps) {
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-[210mm] h-auto p-8 bg-white text-black font-sans border mx-auto text-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{company?.name || "B Store"}</h1>
          <p className="text-sm">
            {company?.address || "123 Business St, Mumbai, India"}
          </p>
          <p className="text-sm">GSTIN: {company?.gst || "22AAAAA0000A1Z5"}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">Invoice</h2>
          <p>Order ID: {orderId}</p>
          <p>Date: {date}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Bill To:</h3>
        <p>{customer.name}</p>
        <p>{customer.phone}</p>
        {customer.email && <p>{customer.email}</p>}
        {customer.address && <p>{customer.address}</p>}
      </div>

      <table className="w-full border border-collapse border-gray-400 text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2">HSN</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{item.product.name}</td>
              <td className="border p-2 text-center">
                {item.product.hsnCode || "-"}
              </td>
              <td className="border p-2 text-center">{item.product.unit}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">
                ₹{item.price.toFixed(2)}
              </td>
              <td className="border p-2 text-right">
                ₹{(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <div className="flex-1">{notes || ""}</div>
        <div className="w-1/3">
          <div className="flex justify-between border-t border-b py-2">
            <span className="font-semibold">Grand Total</span>
            <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-600">
        <p>Thank you for your business!</p>
        <p className="mt-1">Managed by Turtltech.com</p>
        <p className="mt-1">Contact: +919958040595</p>
      </div>
    </div>
  );
}
