import { prismaDB } from "@/lib/connect-db";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

export const productLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const products = await prismaDB.product.findMany();
  return { data: products };
};
