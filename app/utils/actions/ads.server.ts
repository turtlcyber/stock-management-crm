import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { apiFetch } from "../api.server";

export const AdsCreateAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const title = formData.get("title") as string;
  const businessId = formData.get("businessId") as string;
  const adType = formData.get("adType") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  if (!image || !title || !businessId || !adType || !startDate || !endDate) {
    return { error: "All fields are required" };
  }

  const response = await apiFetch(request, "/admin/ads/create", {
    method: "POST",
    data: formData,
  });
  if (response instanceof Response) throw response;
  return { success: true, message: "Ad created successfully" };
};

export const AdsEditAction: ActionFunction = async ({ request, params }) => {
  const { adId } = params;
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const title = formData.get("title") as string;
  const businessId = formData.get("businessId") as string;
  const adType = formData.get("adType") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  if (!image || !title || !businessId || !adType || !startDate || !endDate) {
    return { error: "All fields are required" };
  }

  const response = await apiFetch(request, "/admin/ads/" + adId, {
    method: "PUT",
    data: formData,
  });
  if (response instanceof Response) throw response;

  return { success: true, message: "Ad updated successfully" };
};

export const AdDeleteAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const response = await apiFetch(request, `/admin/ads/${id}`, {
    method: "DELETE",
  });
  if (response instanceof Response) throw response;
  if (response.error) {
    return { error: response.error, status: 500 };
  }
  return { success: true, message: "News deleted successfully" };
};
