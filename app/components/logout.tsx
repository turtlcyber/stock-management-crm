import { Form } from "@remix-run/react";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Logout = () => {
  return (
    <Form method="POST" action="/auth/logout">
      <Button title="Logout" size={"icon"} variant={"outline"}>
        <LogOut />
      </Button>
    </Form>
  );
};

export default Logout;
