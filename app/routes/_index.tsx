import { json, redirect } from "@remix-run/node";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Flashcard from "~/components/Flashcard";
import { loadWord, logOccurrence } from "~/services/word";
import { getSession, commitSession } from "../sessions";
import { debugFormData } from "~/utils/debug";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Hungarian flashcards" }];
};

export const loader = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const words = session.data.words || [];
  const index = session.data.index || 0;
  session.set("index", index);

  let word = null;
  if (words.length && index < words.length - 1) {
    word = words[index];
  } else {
    word = await loadWord();
    words.push(word);
    session.set("words", words);
  }

  return json(
    { word, session },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  debugFormData(form);
  const wordId = Number(form.get("wordId"));

  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    session.set("userId", "1");
  }
  const index = session.get("index")!;

  const intent = form.get("intent");
  if (intent === "forward") {
    session.set("index", index + 1);
    await logOccurrence(wordId);
  } else if (intent === "backward" && index > 0) {
    // TODO: block button
    session.set("index", index - 1);
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Index() {
  const { word } = useLoaderData();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        margin: "0 auto",
        maxWidth: 1200,
        marginTop: 150,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flashcard word={word} />
        <form method="POST" action="/?index">
          <button
            name="intent"
            value="backward"
            style={{
              background: "none",
              color: "inherit",
              border: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
              outline: "inherit",
            }}
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </button>

          <input type="hidden" name="wordId" value={word.id} />

          <button
            name="intent"
            value="forward"
            style={{
              background: "none",
              color: "inherit",
              border: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
              outline: "inherit",
            }}
          >
            <ArrowForwardIosIcon fontSize="large" />
          </button>
        </form>
      </div>
    </div>
  );
}
