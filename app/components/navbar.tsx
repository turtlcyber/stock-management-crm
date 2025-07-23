import React from "react";
import Logout from "./logout";
import { Session } from "@/utils/auth.server";

const Navbar = ({ session }: { session: Session }) => {
  return (
    <nav className="fixed bg-white left-0 right-0 h-12 border-b flex justify-between items-center px-4">
      <div>
        <img src="/logo.png" className="h-8" />
      </div>
      <Logout />
    </nav>
  );
};

export default Navbar;
