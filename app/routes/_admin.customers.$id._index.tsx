import { customerByIdLoader as loader } from "@/server/customer.loader";
import { useLoaderData } from "@remix-run/react";
import { Order, OrderItem, Product } from "@prisma/client";
import { Column, createColumn } from "@/components/table/CreateColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { UserRound } from "lucide-react";
import { format } from "date-fns";
export { loader };

const AdminCustomerInfo = () => {
  const data = useLoaderData<typeof loader>();
  if (!data) return null;

  const { customer, orders } = data;

  const columns: Column<
    Order & { orderItems: (OrderItem & { product: Product })[] }
  >[] = [
    createColumn("Items", (c) => c.orderItems.length),
    createColumn("Total", (c) => `${c.totalAmount}`),
    createColumn("Payment Method", (c) => c.paymentType),
    createColumn("Items List", (c) => (
      <div>
        <ul className=" list-disc">
          {c.orderItems.map((el) => (
            <li key={el.id}>{el.product.name}</li>
          ))}
        </ul>
      </div>
    )),
  ];

  return (
    <div className="p-4">
      <div className="bg-white py-4">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <UserRound className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Customer Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 font-medium mb-1">Name</p>
            <p className="font-semibold">{customer.name}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Phone</p>
            <p className="font-semibold">{customer.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Email</p>
            <p className="font-semibold">{customer.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Address</p>
            <p className="font-semibold">{customer.address || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500 font-medium mb-1">Joined On</p>
            <p className="font-semibold">
              {format(customer.createdAt, "dd-MMMM-yyyy")}
            </p>
          </div>
        </div>
      </div>

      <GenericTable columns={columns} header="" data={orders} hideTopBar />
    </div>
  );
};

export default AdminCustomerInfo;
