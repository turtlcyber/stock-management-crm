import { prismaDB } from "@/lib/connect-db";

export const ordersLoader = async () => {
  const compnay = await prismaDB.company.findFirst();
  const orders = await prismaDB.order.findMany({
    include: { orderItems: { include: { product: true } }, customer: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data: { orders, compnay } };
};
