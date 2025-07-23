import { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetch } from "../api.server";

export const userConversationsLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const { userId } = params;
  const response = await apiFetch(request, `/admin/chat/${userId}/user-list`);
  if (response instanceof Response) throw response;
  return response;
};
