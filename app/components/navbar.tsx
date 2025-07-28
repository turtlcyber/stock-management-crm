import React from "react";
import Logout from "./logout";
import { Session } from "@/utils/auth.server";

const Navbar = ({ session }: { session: Session }) => {
  return (
    <nav className="fixed bg-white left-0 right-0 h-12 border-b flex justify-between items-center px-4">
      <div className="flex items-center">
        <img src="/logo1.png" className="h-8 w-14 object-cover" />
        <img src="/logo2.png" className="h-8 w-24 object-cover" />
      </div>
      <Logout />
    </nav>
  );
};

export default Navbar;
