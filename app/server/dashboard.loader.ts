import { prismaDB } from "@/lib/connect-db";

export const dashboardLoader = async () => {
  //   const customers = await prismaDB.customer.findMany();
  //   const products = await prismaDB.product.findMany();
  const [customers, products, orders] = await Promise.all([
    prismaDB.customer.findMany(),
    prismaDB.product.findMany(),
    prismaDB.order.findMany({
      include: { orderItems: {include:{product:true}}, customer: true },
    }),
  ]);
  return { customers, products, orders };
};
