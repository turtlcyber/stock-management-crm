import { Outlet, useLoaderData } from "@remix-run/react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { requireUserSession } from "@/utils/auth.server";

export const loader = async ({ request }: { request: Request }) => {
  const session = await requireUserSession(request);
  return session;
};

const AdminLayout = () => {
  const session = useLoaderData<typeof loader>();
  return (
    <div className="bg-white">
      <Navbar session={session} />
      <Sidebar />
      <main className="ps-60 pt-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
