import { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetch } from "../api.server";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  messageOwnerId: string;
  status: string;
  messageType: string;
};
export const conversationLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const { conversationId } = params;
  const response = await apiFetch(
    request,
    `/admin/chat/conversations/${conversationId}`
  );
  if (response instanceof Response) throw response;
  const conversation: Message[] = response.data;
  return { data: conversation };
};
