import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/utils/api.server";
import { createUserSession } from "@/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await apiFetch(request, "/admin/auth/login", {
    method: "POST",
    data: { email, password },
  });

  if (response instanceof Response) return response;
  

  if (response.error) {
    return { error: response.error };
  }
  const { token, userId, name, role, avatarUrl } = response.data;

  return await createUserSession(
    {
      id: userId,
      name,
      email,
      role,
      avatarUrl,
      token,
    },
    "/admin"
  );
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<typeof action>();

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <Card>
            <Form method="POST">
              <CardHeader>
                <CardTitle className="">
                  <img src="/logo.png" className="h-24" />
                  <h1 className="font-bold text-lg mt-2">
                    Sign in to your account
                  </h1>
                  {actionData?.error && (
                    <p style={{ color: "red" }}>{actionData.error}</p>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" />
                </div>
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-8 text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Login</Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </div>
    </section>
  );
}
