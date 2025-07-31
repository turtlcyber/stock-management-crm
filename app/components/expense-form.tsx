import { useFetcher } from "@remix-run/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import toast from "react-hot-toast";

type ActionResponse = {
  success: boolean;
  message: string;
};

export default function NewExpenseForm() {
  const fetcher = useFetcher();
  const data = fetcher.data as ActionResponse | undefined;

  useEffect(() => {
    if (data?.success) {
      toast.success(data.message);
    }
  }, [data]);

  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form
      method="post"
      action="/api/create-expense"
      className="space-y-4"
    >
      <Input name="title" placeholder="Title" required />
      <Input name="amount" placeholder="Amount" type="number" required />
      <Textarea name="notes" placeholder="Notes (optional)" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Expense"}
      </Button>
    </fetcher.Form>
  );
}
