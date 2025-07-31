import React, { useEffect } from "react";
import { expenseCreate as action } from "@/server/compnay.action";
import { Form, useActionData, useNavigate, useNavigation } from "@remix-run/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

export { action };

const ExpenseData = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success && navigation.state === "idle") {
      toast.success(actionData.message);
       navigate("/company");
    }
  }, [actionData, navigation.state]);

  return (
    <div className="p-4 max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Expense Entry
      </h2>

      <Form method="post" className="space-y-4">
        <Input name="title" placeholder="Title" required />
        <Input name="amount" placeholder="Amount" type="number" required />
        <Input name="date" type="date" />
        <Textarea name="notes" placeholder="Notes (optional)" />
        <Button type="submit" disabled={navigation.state === "loading"}>
          {navigation.state === "loading" ? "Submitting..." : "Add Expense"}
        </Button>
      </Form>
    </div>
  );
};

export default ExpenseData;
