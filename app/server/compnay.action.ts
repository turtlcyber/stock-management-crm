import { prismaDB } from "@/lib/connect-db";
import { ActionFunctionArgs } from "@remix-run/node";

export const companyCreate = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const address = formData.get("address")?.toString();
  const gst = formData.get("gst")?.toString();

  if (!name || !address || !gst) {
    return {
      success: false,
      message: "All required field should be filled",
    };
  }

  const company = await prismaDB.company.findFirst();
  if (company) {
    await prismaDB.company.update({
      where: { id: company.id },
      data: { name, address, gst },
    });
  } else {
    await prismaDB.company.create({ data: { name, address, gst } });
  }

  return {
    success: true,
    message: "New record added successfully",
  };
};

export const expenseCreate = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const amount = formData.get("amount")?.toString();
  const date = formData.get("date")?.toString();
  const notes = formData.get("notes")?.toString();
  console.log(title);
  console.log(amount);
  console.log(date);
  console.log(notes);
  if (!title || !amount || !date) {
    return {
      success: false,
      message: "All required field should be filled",
    };
  }

  await prismaDB.expense.create({
    data: {
      title,
      amount: Number(amount),
      date: new Date(date),
      notes,
    },
  });

  return {
    success: true,
    message: "New Expense created successfully",
  };
};
