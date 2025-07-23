import { prismaDB } from "@/lib/connect-db";
import { ActionFunctionArgs } from "@remix-run/node";

export const productCreate = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const price = formData.get("price")?.toString();
  const sellPrice = formData.get("sellPrice")?.toString();
  const expDate = formData.get("expDate")?.toString();
  const hsnCode = formData.get("hsnCode")?.toString();
  const unit = formData.get("unit")?.toString();
  const size = formData.get("size")?.toString();
  const stockQty = formData.get("stockQty")?.toString();
  const description = formData.get("description")?.toString();

  if (!name || !price || !sellPrice || !unit) {
    return {
      success: false,
      message: "All required field should be filled",
    };
  }

  await prismaDB.product.create({
    data: {
      name,
      price: Number(price),
      sellPrice: Number(sellPrice),
      expDate: expDate ? new Date(expDate) : null,
      hsnCode,
      unit,
      size,
      stockQty: stockQty ? Number(stockQty) : 1,
      description,
    },
  });
  return {
    success: true,
    message: "Product created successfully",
  };
};
