import { prismaDB } from "@/lib/connect-db";
import { ActionFunctionArgs } from "@remix-run/node";

export const orderCreateAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const orderItems = JSON.parse(formData.get("orderItems") as string);
  const selectedCustomer = formData.get("selectedCustomer") as string;
  const paymentType = formData.get("paymentType") as string;


  const totalAmount = orderItems.reduce(
    (acc: number, curr: any) => acc + curr.quantity * curr.price,
    0
  );
  try {
    await prismaDB.order.create({
      data: {
        customerId: selectedCustomer,
        paymentType,
        totalAmount,
        orderItems: {
          create: orderItems,
        },
      },
    });

    return { success: true, message: "Order created successfully" };
  } catch (error) {
    return { success: false, message: "Failed to create order" };
  }
};
