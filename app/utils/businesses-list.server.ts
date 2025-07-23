import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetch } from "@/utils/api.server";
import { requireUserSession } from "./auth.server";
import { env } from "./env.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { imageUrl } = env;
  await requireUserSession(request);
  const usersData = await apiFetch(
    request,
    "/admin/user-business/business-list"
  );

  if (usersData instanceof Response) {
    return usersData; 
  }

  return { data: usersData.data, imageUrl };
};
