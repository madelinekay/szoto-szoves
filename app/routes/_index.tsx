import { json, redirect } from "@remix-run/node";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";

import Flashcard from "~/components/Flashcard";
import { loadWord, sampleWord, logOccurrence } from "~/services/word";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Hungarian flashcards" }];
};

export const loader = async () => {
  const word = await loadWord();
  const sample = await sampleWord();
  return json(word);
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const wordId = Number(form.get("wordId"));
  await logOccurrence(wordId);
  return redirect("/");
};

const moveBack = () => {
  console.log("moveback");
};

export default function Index() {
  const words = useState([]);
  const index = useState(null);
  const word = useLoaderData();

  words.push(word);

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
        <ArrowBackIosNewIcon fontSize="large" onClick={moveBack} />
        <Flashcard word={word} />
        <form method="POST" action="/?index">
          <input type="hidden" name="wordId" value={word.id} />
          <button
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
