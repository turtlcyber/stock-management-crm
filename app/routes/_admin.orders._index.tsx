import React from "react";
import { ordersLoader as loader } from "@/server/order.loader";
import { useLoaderData } from "@remix-run/react";
import { GenericTable } from "@/components/table/GenericTable";
import { Customer, Order, OrderItem, Product } from "@prisma/client";
import { Column, createColumn } from "@/components/table/CreateColumn";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import PrintPage, { InvoiceContent } from "@/components/print-component";
import DownloadPDFButtonProps from "@/components/print-component";
import DownloadPDFButton from "@/components/print-component";
import { format } from "date-fns";
export { loader };

type OrderT = Order & {
  customer: Customer;
  orderItems: (OrderItem & { product: Product })[];
};

const Orders = () => {
  const { data } = useLoaderData<typeof loader>();

  const columns: Column<OrderT>[] = [
    createColumn("Customer", (c) => c.customer.name),
    createColumn("Items", (c) => c.orderItems.length),
    createColumn("Total", (c) => `${c.totalAmount}`),
    createColumn("Payment Method", (c) => c.paymentType),
    createColumn("Action", (c) => (
      <div className="flex justify-start space-x-1">
        <DownloadPDFButton
          filename={ "invoice_123.pdf"}
          content={
            <InvoiceContent
              orderId={c.id.toUpperCase()}
              date={format(c.createdAt, "dd-MM-yyyy")}
              company={data.compnay}
              customer={{
                name: c.customer.name,
                phone: c.customer.phone,
                email: c.customer.email ?? "",
                address: c.customer.address ?? "",
              }}
              orderItems={c.orderItems.map((el) => {
                return {
                  product: {
                    name: el.product.name,
                    hsnCode: el.product.hsnCode ?? "",
                    unit: el.product.unit,
                    size: el.product.size ?? "",
                  },
                  quantity: el.quantity,
                  price: el.price,
                };
              })}
            />
          }
        />
      </div>
    )),
  ];
  return (
    <div className="p-4">
      <GenericTable
        columns={columns}
        header="Orders List"
        data={data.orders.map((el) => ({
          ...el,
          customer: el.customer!,
          orderItems: el.orderItems,
        }))}
      />
    </div>
  );
};

export default Orders;
