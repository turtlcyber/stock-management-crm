import React from "react";
import { customerLoader as loader } from "@/server/customer.loader";
import { Link, useLoaderData } from "@remix-run/react";
import { Customer } from "@prisma/client";
import { Column, createColumn } from "@/components/table/CreateColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { Button } from "@/components/ui/button";
import { InfoIcon, Pencil, UserRound } from "lucide-react";
import { format } from "date-fns";
export { loader };

const AdminCustomer = () => {
  const { data } = useLoaderData<typeof loader>();

  const columns: Column<Customer>[] = [
    createColumn("Name", (c) => c.name),
    createColumn("Phone", (c) => c.phone),
    createColumn("Email", (c) => c.email),
    createColumn("Address", (c) => c.address),
    createColumn("Created At", (c) =>
      format(new Date(c.createdAt), "MMM dd, yyyy")
    ),
    createColumn("Action", (c) => (
      <div className="flex justify-start space-x-1">
        <Button size={"icon"} asChild type="button">
          <Link to={`/admin/customers/${c.id}`}>
            <UserRound />
          </Link>
        </Button>
      </div>
    )),
  ];
  return (
    <div className="p-4">
      <GenericTable
        columns={columns}
        data={data as Customer[]}
        header="Customers"
        addUrl={{ title: "New Customer", url: "/admin/customers/new" }}
      />
    </div>
  );
};

export default AdminCustomer;
