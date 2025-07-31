import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { dashboardLoader as loader } from "@/server/dashboard.loader";
import { orderCreateAction as action } from "@/server/order.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  LayoutDashboard,
  Pencil,
  SaveIcon,
  ScanLine,
  ShoppingCart,
  Trash,
  TrendingDown,
  TrendingUp,
  UsersIcon,
} from "lucide-react";
import { Column, createColumn } from "@/components/table/CreateColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { Combobox } from "@/components/ui/combobox";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Customer, Order, OrderItem, Product } from "@prisma/client";
import toast from "react-hot-toast";
import DownloadPDFButton, {
  InvoiceContent,
} from "@/components/print-component";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export { loader, action };

type OrderT = Order & {
  customer: Customer;
  orderItems: (OrderItem & { product: Product })[];
};
type OrderRow = { productId: string; quantity: number; price: number };

const AdminHome = () => {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderRow[]>([]);
  const [paymentType, setPaymentType] = useState<string>("cash");
  const [notes, setNotes] = useState<string>("");

  const addProductRow = () => {
    setOrderItems((prev) => [
      ...prev,
      { productId: "", quantity: 1, price: 0 },
    ]);
  };

  const updateProductRow = (
    index: number,
    field: keyof OrderItem,
    value: string | number,
    price: number
  ) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (item.price === 0) {
          return i === index ? { ...item, [field]: value, price } : item;
        }
        return i === index ? { ...item, [field]: value } : item;
      })
    );
  };

  const getProductPrice = (productId: string): number => {
    const prod = data.products.find((p) => p.id === productId);
    console.log("Prod", prod);
    return prod ? prod.sellPrice : 0;
  };

  const getProductPriceFromOrderItems = (productId: string): number => {
    const prod = orderItems.find((p) => p.productId === productId);
    return prod ? prod.price : 0;
  };

  const getRowTotal = (item: OrderRow) => {
    return getProductPriceFromOrderItems(item.productId) * item.quantity;
  };

  const getOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + getRowTotal(item), 0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      toast.error("Please select the customer");
      return;
    }
    if (!paymentType) {
      toast.error("Please select the mode of payment");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Product not added");
      return;
    }

    const formData = new FormData();
    formData.append("selectedCustomer", selectedCustomer);
    formData.append("paymentType", paymentType);
    formData.append("notes", notes);
    formData.append("orderItems", JSON.stringify(orderItems));

    fetcher.submit(formData, { method: "post" });
  };

  const columns: Column<OrderT>[] = [
    createColumn("Customer", (c) => c.customer.name),
    createColumn("Items", (c) => c.orderItems.length),
    createColumn("Qty", (c) =>
      c.orderItems.reduce((acc, curr) => acc + curr.quantity, 0)
    ),
    createColumn("Price", (c) => c.orderItems[0].price),
    createColumn("Total", (c) => `${c.totalAmount}`),
    createColumn("Payment Method", (c) => c.paymentType),
    createColumn("Action", (c) => (
      <div className="flex justify-start space-x-1">
        <div className="flex justify-start space-x-1">
          <DownloadPDFButton
            filename="invoice_123.pdf"
            content={
              <InvoiceContent
                company={data.compnay}
                orderId={c.id.toUpperCase()}
                notes={c.notes}
                date={format(c.createdAt, "dd-MM-yyyy")}
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
      </div>
    )),
  ];
  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
      setSelectedCustomer(null);
      setOrderItems([]);
      setPaymentType("cash");
      setNotes("");
    } else if (fetcher.data?.success === false) {
      toast.error(fetcher.data.message);
    }
  }, [fetcher.data]);

  const difference = data.totalProfit - data.totalExpense;
  const isPositive = difference >= 0;
  return (
    <div className="grid grid-cols-1 gap-4 p-6">
      <div>
        <Card className="bg-pink-100">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <LayoutDashboard className="mr-2 text-blue-700" /> Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border rounded-2xl p-4 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-600">
                    Total Sales
                  </h2>
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  ₹
                  {data.orders.reduce((acc, curr) => {
                    return curr.totalAmount + acc;
                  }, 0)}
                </div>
              </div>
              <div className="bg-white border rounded-2xl p-4 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-600">
                    Orders
                  </h2>
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{data.orders.length}
                </div>
              </div>
              <div className="bg-white border rounded-2xl p-4 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-600">
                    Customers
                  </h2>
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{data.customers.length}
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-4 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-600">
                    Profit
                  </h2>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div
                  className={cn(
                    "mt-2 text-2xl font-bold",
                    data.totalProfit < 0 ? "text-red-600" : "text-gray-900"
                  )}
                >
                  ₹{data.totalProfit}
                </div>
              </div>
              <div className="bg-white border rounded-2xl p-4 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-600">
                    Expense
                  </h2>
                  <TrendingDown className="h-6 w-6 text-blue-600" />
                </div>
                <div
                  className={cn(
                    "mt-2 text-2xl font-bold",
                    data.totalExpense < 0 ? "text-red-600" : "text-gray-900"
                  )}
                >
                  ₹{data.totalExpense}
                </div>
              </div>

              <div
                className={cn(
                  " border rounded-2xl p-4 ",
                  isPositive ? "bg-blue-100" : "bg-yellow-100"
                )}
              >
                <div className="flex items-center justify-between">
                  <h2
                    className={cn(
                      "text-sm font-semibold ",
                      isPositive ? "text-blue-800" : "text-yellow-800"
                    )}
                  >
                    {isPositive ? "Net Profit" : "Net Loss"}
                  </h2>
                  <DollarSign
                    className={`w-6 h-6 ${
                      isPositive ? "text-blue-600" : "text-yellow-600"
                    }`}
                  />
                </div>
                <div
                  className={cn(
                    "mt-2 text-2xl font-bold ",
                    isPositive ? "text-blue-900" : "text-yellow-900"
                  )}
                >
                  ₹{Math.abs(difference).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-2xl overflow-hidden">
          <GenericTable
            header="Orders"
            columns={columns}
            data={data.orders.map((el) => ({
              ...el,
              customer: el.customer!,
              orderItems: el.orderItems,
            }))}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <ScanLine className="mr-2 text-blue-700" /> Point of sale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Select */}
              <div>
                <label className="block mb-1 font-medium">Customer</label>
                <Combobox
                  value={selectedCustomer}
                  onValueChange={(val) => setSelectedCustomer(val)}
                  data={data.customers.map((el) => ({
                    label: `${el.name} - ${el.phone}`,
                    value: el.id,
                  }))}
                  placeholder="Customer"
                />
              </div>

              {/* Product Table */}
              <div>
                <label className="block mb-1 font-medium">Products</label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Unit Price</th>
                        <th className="px-4 py-2 text-left">Qty</th>
                        <th className="px-4 py-2 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2 w-64">
                            <Combobox
                              value={item.productId}
                              onValueChange={(val) => {
                                updateProductRow(
                                  index,
                                  "productId",
                                  val,
                                  getProductPrice(val)
                                );
                              }}
                              data={data.products.map((el) => ({
                                label: `${el.name}`,
                                value: el.id,
                              }))}
                              placeholder="Product"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.price}
                              className="bg-white"
                              onChange={(e) => {
                                const price = parseInt(e.target.value);
                                console.log(price);
                                updateProductRow(
                                  index,
                                  "price",
                                  isNaN(price) ? 1 : price,
                                  getProductPrice(item.productId)
                                );
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 w-32">
                            <Input
                              type="number"
                              min="1"
                              className="bg-white"
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value);
                                updateProductRow(
                                  index,
                                  "quantity",
                                  isNaN(qty) ? 1 : qty,
                                  getProductPrice(item.productId)
                                );
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-center">
                              ₹{getRowTotal(item).toFixed(2)}
                            </div>
                            <Button
                              onClick={() => {
                                setOrderItems((pre) => {
                                  return pre.filter((el, idx) => idx !== index);
                                });
                              }}
                              className="text-red-600"
                              size={"icon"}
                              variant={"ghost"}
                            >
                              <Trash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={addProductRow}
                >
                  + Add Product
                </Button>
              </div>

              {/* Payment Type */}
              <div>
                <label className="block mb-1 font-medium">Payment Type</label>
                <Select
                  onValueChange={(val) => setPaymentType(val)}
                  value={paymentType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-1 font-medium">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white"
                  placeholder="Optional notes about this order"
                />
              </div>

              {/* Total and Submit */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-semibold">
                  Total: ₹{getOrderTotal().toFixed(2)}
                </div>
                <Button type="submit" className="px-6">
                  <SaveIcon /> Submit Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
