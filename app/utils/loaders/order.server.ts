import { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetch } from "../api.server";
import { OrderModel } from "@/types/order";
import { env } from "../env.server";

export const OrderListLoader = async ({ request }: LoaderFunctionArgs) => {
  const response = await apiFetch(request, "/admin/order/list");
  if (response instanceof Response) throw response;

  return { data: response.data };
};

export const OrderById = async ({ request, params }: LoaderFunctionArgs) => {
  const { orderId } = params;

  const response = await apiFetch(request, "/admin/order/" + orderId);
  if (response instanceof Response) throw response;

  return { data: response.data as OrderModel | null, imageUrl: env.imageUrl };
};
