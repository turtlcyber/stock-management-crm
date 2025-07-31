import React, { useEffect, useState } from "react";
import { companyLoaderWithExpense as loader } from "@/server/compnay.loader";
import { companyCreate as action } from "@/server/compnay.action";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { GenericTable } from "@/components/table/GenericTable";
import { Expense } from "@prisma/client";
import { Column, createColumn } from "@/components/table/CreateColumn";
import { format } from "date-fns";

export { loader, action };

const CompnayData = () => {
  const { data } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (actionData?.success && navigation.state === "idle") {
      toast.success(actionData.message);
      setIsEdit(false);
    }
  }, [actionData, navigation.state]);

  const columns: Column<Expense>[] = [
    createColumn("Title", (c) => c.title),
    createColumn("Amount", (c) => c.amount),
    createColumn("Date", (c) => format(new Date(c.date), "MMM dd, yyyy")),
    createColumn("Notes", (c) => c.notes),
  ];
  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Company Information
        </h2>

        <div className="grid gap-5 text-gray-700 text-sm md:text-base">
          <div>
            <p className="text-gray-500 mb-1">Company Name</p>
            <p className="font-medium">{data?.compnayData?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Address</p>
            <p className="font-medium">{data?.compnayData?.address ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">GST Number</p>
            <p className="font-medium">{data?.compnayData?.gst ?? "N/A"}</p>
          </div>
        </div>

        <div className="mt-10">
          {!isEdit && (
            <Button onClick={() => setIsEdit(true)}>Edit Info</Button>
          )}
          {isEdit && (
            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">
                    Compnay Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="name"
                    id="name"
                    defaultValue={data?.compnayData?.name}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">
                    Address <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="address"
                    id="address"
                    defaultValue={data?.compnayData?.address}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gst">
                    GST<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="gst"
                    id="gst"
                    required
                    defaultValue={data?.compnayData?.gst}
                  />
                </div>
              </div>
              <Button type="submit" disabled={navigation.state === "loading"}>
                {navigation.state === "loading" ? "Submitting..." : "Submit"}
              </Button>
            </Form>
          )}
        </div>
      </div>
      <div className="mt-5">
        <div className="border rounded-2xl overflow-hidden">
          <GenericTable
            columns={columns}
            data={data.expenseData}
            header="Expenses"
            addUrl={{ title: "New Expense", url: "/company/new-expense" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompnayData;
