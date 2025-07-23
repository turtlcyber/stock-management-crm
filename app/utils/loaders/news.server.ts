import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { apiFetch } from "../api.server";
import { env } from "../env.server";
type NewsItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  language: string;
  createdAt: string;
};

export const newsListLoader = async ({ request }: LoaderFunctionArgs) => {
  const imageUrl = env.imageUrl;
  const response = await apiFetch(request, "/admin/news/list");

  if (response instanceof Response) throw response;

  return { data: response.data as NewsItem[], imageUrl };
};

export const newsByIdLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const imageUrl = env.imageUrl;
  const response = await apiFetch(request, `/admin/news/${params.newsId}`);
  if (response instanceof Response) throw response;

  return { data: response.data as NewsItem, imageUrl };
};
