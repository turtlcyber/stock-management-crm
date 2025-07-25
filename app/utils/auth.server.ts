import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { env } from "./env.server";

export type Session = {
  id: string;
  username: string;
  token: string;
};

type UserSession = {
  id: string;
  username: string;
  token: string;
};

if (!env.sessionSecret) {
  throw new Error("SESSION_SECRET must be set in environment variables.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [env.sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function createUserSession(user: UserSession, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", user.id);
  session.set("username", user.username);
  session.set("token", user.token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

async function getSession(request: Request) {
  return await storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  return session.get("userId");
}

async function requireUserSession(
  request: Request,
  redirectTo: string = "/auth/login"
): Promise<Session> {
  const session = await getSession(request);

  const userId = session.get("userId");
  const username = session.get("username");
  const token = session.get("token");

  if (!userId || !token || !username) {
    throw redirect(redirectTo);
  }

  return {
    id: userId,
    username,
    token,
  };
}

async function logout(request: Request, redirectTo: string = "/") {
  const session = await getSession(request);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export { createUserSession, getSession, getUserId, requireUserSession, logout };
