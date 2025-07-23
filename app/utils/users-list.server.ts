import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetch } from "@/utils/api.server";
import { requireUserSession } from "./auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);
  const usersData = await apiFetch(request, "/admin/user-business/user-list");
  return usersData;
};
