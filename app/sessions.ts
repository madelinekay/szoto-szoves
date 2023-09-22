import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type word = {
  id: number;
  word: string;
  eng: string;
  pos: string;
  present_class_id: number | null;
  past_class_id: number | null;
  subjunctive_class_id: number | null;
  original_compound: string | null;
  difficulty: number | null;
};

type SessionData = {
  userId: string;
  words: word[];
  index: number;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      // domain: "remix.run",
      // expires: new Date(Date.now() + 60_000),
      // httpOnly: true,
      // maxAge: 60,
      // path: "/",
      // sameSite: "lax",
      // secrets: ["s3cret1"],
      // secure: true,
    },
  });

export { getSession, commitSession, destroySession };
