import { prismaDB } from "@/lib/connect-db";
import { LoaderFunctionArgs } from "@remix-run/node";

export const customerLoader = async () => {
  const customers = await prismaDB.customer.findMany();
  return { data: customers };
};

export const customerByIdLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const { id } = params;
  const customer = await prismaDB.customer.findUnique({ where: { id } });
  if (!customer) return null;
  const orders = await prismaDB.order.findMany({
    where: {
      customerId: customer.id,
    },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  return { customer, orders };
};
