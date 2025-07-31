import { prismaDB } from "@/lib/connect-db";

export const companyLoader = async () => {
  const data = await prismaDB.company.findFirst();
  return { data };
};

export const companyLoaderWithExpense = async () => {
  const compnayData = await prismaDB.company.findFirst();
  const expenseData = await prismaDB.expense.findMany();

  return { data: { compnayData, expenseData } };
};
