import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "@/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return logout(request, "/auth/login");
};
