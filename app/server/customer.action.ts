import { prismaDB } from "@/lib/connect-db";
import { ActionFunctionArgs } from "@remix-run/node";

export const customerCreate = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();

  if (!name || !phone) {
    return {
      success: false,
      message: "All required field should be filled",
    };
  }

  const customer = await prismaDB.customer.findUnique({ where: { phone } });
  if (customer)
    return {
      success: false,
      message: "This phone number is already registered.",
    };

  await prismaDB.customer.create({
    data: {
      name,
      phone,
      email,
    },
  });
  return {
    success: true,
    message: "New customer added successfully",
  };
};
