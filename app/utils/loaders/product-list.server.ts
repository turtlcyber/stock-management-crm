import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetch } from "@/utils/api.server";
import { env } from "../env.server";
import { requireUserSession } from "../auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { businessId } = params;
  const { imageUrl } = env;

  await requireUserSession(request);

  const response = await apiFetch(
    request,
    `/admin/user-business/${businessId}/products`
  );
  if (response instanceof Response) throw response;

  return { data: response.data, imageUrl };
};
