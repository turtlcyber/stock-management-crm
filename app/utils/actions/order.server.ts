import { ActionFunction } from "@remix-run/node";
import { apiFetch } from "../api.server";

export const orderUpdateActionAdmin: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();
  const { orderId } = params;
  const status = formData.get("status");
  const maxTime = formData.get("maxTime");
  const response = await apiFetch(request, `/admin/order/${orderId}`, {
    method: "PUT",
    data: formData,
  });
  if (response instanceof Response) throw response;
  if (response.error) {
    return { error: response.error, status: 500 };
  }
  return { success: true, message: "Order updated successfully" };
};
