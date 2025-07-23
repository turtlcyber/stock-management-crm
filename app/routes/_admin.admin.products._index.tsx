import React from "react";
import { productLoader as loader } from "@/server/product.loader";
import { Link, useLoaderData } from "@remix-run/react";
import { GenericTable } from "@/components/table/GenericTable";
import { Product } from "@prisma/client";
import { Column, createColumn } from "@/components/table/CreateColumn";
import { format } from "date-fns";
export { loader };

const Products = () => {
  const { data } = useLoaderData<typeof loader>();

  const columns: Column<Product>[] = [
    createColumn("Name", (c) => c.name),
    createColumn("Price", (c) => `₹${Number(c.sellPrice).toFixed(2)}`),
    createColumn("expDate", (c) =>
      c.expDate ? format(c.expDate, "MMM dd, yyyy") : "N/A"
    ),
    createColumn("HSN", (c) => c.hsnCode),
    createColumn("Unit", (c) => c.unit),
    createColumn("Available Stock", (c) => c.stockQty),
    createColumn("Created At", (c) =>
      format(new Date(c.createdAt), "MMM dd, yyyy")
    ),
  ];
  return (
    <div className="p-4">
      <GenericTable
        columns={columns}
        data={data}
        header="Product List"
        addUrl={{ title: "New Product", url: "/admin/products/new" }}
      />
    </div>
  );
};

export default Products;
