import { prismaDB } from "@/lib/connect-db";
import { createUserSession } from "@/utils/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { success: false, error: "All fields are required." };
  }

  const user = await prismaDB.user.findUnique({ where: { username } });
  if (!user) {
    return { success: false, error: "Invalid username" };
  }

  const isVerified = await bcrypt.compare(password, user.password);
  if (!isVerified) {
    return { success: false, error: "Unauthorized" };
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.SESSION_SECRET || "secretkey",
    { expiresIn: "180d" }
  );

  return await createUserSession(
    {
      id: user.id,
      username,
      token,
    },
    "/"
  );
};
