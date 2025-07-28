import React, { useEffect, useState } from "react";
import { companyLoader as loader } from "@/server/compnay.loader";
import { companyCreate as action } from "@/server/compnay.action";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Company Information
        </h2>

        <div className="grid gap-5 text-gray-700 text-sm md:text-base">
          <div>
            <p className="text-gray-500 mb-1">Company Name</p>
            <p className="font-medium">{data?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Address</p>
            <p className="font-medium">{data?.address ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">GST Number</p>
            <p className="font-medium">{data?.gst ?? "N/A"}</p>
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
                    defaultValue={data?.name}
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
                    defaultValue={data?.address}
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
                    defaultValue={data?.gst}
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
    </div>
  );
};

export default CompnayData;
