import { prismaDB } from "@/lib/connect-db";

export const dashboardLoader = async () => {
  const [customers, products, orders, compnay] = await Promise.all([
    prismaDB.customer.findMany(),
    prismaDB.product.findMany(),
    prismaDB.order.findMany({
      include: { orderItems: { include: { product: true } }, customer: true },
    }),
    prismaDB.company.findFirst(),
  ]);

  const totalProfit = orders.reduce(
    (acc, { orderItems }) =>
      acc +
      orderItems.reduce(
        (sum, { price, product, quantity }) =>
          sum + (price - product.price) * quantity,
        0
      ),
    0
  );

  return { customers, products, orders, compnay, totalProfit };
};
