import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { productCreate as action } from "@/server/product.action";
import toast from "react-hot-toast";
export { action };

export default function NewProduct() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [preview, setPreview] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.forEach((value, key) => console.log(key, value));
  };

  useEffect(() => {
    if (actionData?.success && navigation.state === "idle") {
      toast.success(actionData.message);
      navigate("/admin/products");
    }
  }, [actionData, navigation.state]);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Purchase Price</Label>
            <Input type="number" step="0.01" name="price" id="price" required />
          </div>
          <div>
            <Label htmlFor="sellPrice">Sell Price</Label>
            <Input
              type="number"
              step="0.01"
              name="sellPrice"
              id="sellPrice"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="expDate">Expiry Date</Label>
          <Input type="date" name="expDate" id="expDate" />
        </div>
        <div>
          <Label htmlFor="hsnCode">HSN Code</Label>
          <Input name="hsnCode" id="hsnCode" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input name="unit" id="unit" required />
          </div>
          <div>
            <Label htmlFor="size">Size</Label>
            <Input name="size" id="size" />
          </div>
        </div>
        <div>
          <Label htmlFor="stockQty">Stock Quantity</Label>
          <Input
            type="number"
            name="stockQty"
            id="stockQty"
            defaultValue="1"
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" id="description" />
        </div>

        <Button type="submit" disabled={navigation.state === "loading"}>
          {navigation.state === "loading" ? "Creating..." : "Create Product"}
        </Button>
      </Form>
    </div>
  );
}
