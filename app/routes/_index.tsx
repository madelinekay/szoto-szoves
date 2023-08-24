import { json, redirect } from "@remix-run/node";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Flashcard from "~/components/Flashcard";
import { loadWord, sampleWord, logOccurrence } from "~/services/word";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Hungarian flashcards" }];
};

export const loader = async () => {
  const word = await loadWord();
  const sample = await sampleWord();
  console.log("sample", sample);
  return json(word);
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const wordId = Number(form.get("wordId"));
  await logOccurrence(wordId);
  return redirect("/");
};

export default function Index() {
  const word = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Word: {word.word}</h1>
      <Flashcard word={word} />
    </div>
  );
}
