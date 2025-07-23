import { prismaDB } from "@/lib/connect-db";

export const companyLoader = async () => {
  const data = await prismaDB.company.findFirst();
  return { data };
};
