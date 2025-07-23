import { ActionFunction } from "@remix-run/node";
import { apiFetch } from "../api.server";

export const newsCreateAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sourceUrl = formData.get("sourceUrl") as string;
  const language = formData.get("language") as string;
  const image = formData.get("image");

  if (!title || !description || !sourceUrl || !language) {
    return { error: "All fields are required", status: 400 };
  }

  if (
    !(image instanceof File) ||
    image.size === 0 ||
    image.name.trim() === ""
  ) {
    return { error: "Image file is required", status: 400 };
  }

  const response = await apiFetch(request, "/admin/news/create", {
    method: "POST",
    data: formData,
  });

  if (response instanceof Response) throw response;

  if (response.error) {
    return { error: response.error, status: 500 };
  }
  return { success: true, message: "News created successfully" };
};

export const newsEditAction: ActionFunction = async ({ request, params }) => {
  const { newsId } = params;
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sourceUrl = formData.get("sourceUrl") as string;
  const language = formData.get("language") as string;

  if (!title || !description || !sourceUrl || !language) {
    return { error: "All fields are required", status: 400 };
  }

  const response = await apiFetch(request, `/admin/news/${newsId}`, {
    method: "PUT",
    data: formData,
  });
  if (response instanceof Response) throw response;
  if (response.error) {
    return { error: response.error, status: 500 };
  }
  return { success: true, message: "News created successfully" };
};

export const newsDeleteAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const response = await apiFetch(request, `/admin/news/${id}`, {
    method: "DELETE",
  });
  if (response instanceof Response) throw response;
  if (response.error) {
    return { error: response.error, status: 500 };
  }
  return { success: true, message: "News deleted successfully" };
};
