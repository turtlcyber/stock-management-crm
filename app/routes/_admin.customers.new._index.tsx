import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerLoader as loader } from "@/server/customer.loader";
import { customerCreate as action } from "@/server/customer.action";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
export { loader, action };

const AdminNewCustomer = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success && navigation.state === "idle") {
      toast.success(actionData.message);
      navigate("/customers");
    }
  }, [actionData, navigation.state]);
  return (
    <div className="max-w-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Customer</h1>
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        <div>
          <Label htmlFor="name">
            Full Name <span className="text-red-600">*</span>
          </Label>
          <Input name="name" id="name" required placeholder="John doe" />
        </div>

        <div>
          <Label htmlFor="phone">
            Phone number <span className="text-red-600">*</span>
          </Label>
          <Input name="phone" id="phone" required placeholder="901540...." />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" placeholder="john@example.com" />
        </div>

        <Button type="submit" disabled={navigation.state === "loading"}>
          {navigation.state === "loading" ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </div>
  );
};

export default AdminNewCustomer;
