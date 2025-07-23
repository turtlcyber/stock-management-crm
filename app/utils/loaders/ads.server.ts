import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { apiFetch } from "../api.server";
import { env } from "../env.server";

type BStoreType = {
  id: string;
  name: string;
};

export type AdsDataType = {
  id: string;
  title: string;
  imageUrl: string;
  adType: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  position?: string;
  bStoreId?: string;
  BStore?: BStoreType;
};

export const AdsLoaderBusinessList = async ({
  request,
}: LoaderFunctionArgs) => {
  const { imageUrl } = env;
  const response = await apiFetch(
    request,
    "/admin/user-business/business-list"
  );
  if (response instanceof Response) throw response;

  return { data: response.data, imageUrl };
};

export const AdsLoader = async ({ request }: LoaderFunctionArgs) => {
  const { imageUrl } = env;
  const response = await apiFetch(request, "/admin/ads/list");

  if (response instanceof Response) throw response;

  return { data: response.data as AdsDataType[], imageUrl };
};

export const AdsLoaderById = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const { imageUrl } = env;
  const { adId } = params;
  const response = await apiFetch(request, "/admin/ads/" + adId);

  if (response instanceof Response) throw response;

  return { data: response.data as AdsDataType, imageUrl };
};

export const AdsEditLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const { imageUrl } = env;
  const { adId } = params;
  const adResponse = await apiFetch(request, "/admin/ads/" + adId);

  const businessList = await apiFetch(
    request,
    "/admin/user-business/business-list"
  );

  if (adResponse instanceof Response) throw adResponse;
  if (businessList instanceof Response) throw businessList;

  return {
    data: { ad: adResponse.data as AdsDataType, bList: businessList.data },
    imageUrl,
  };
};
