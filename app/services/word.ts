import { db } from "~/utils/db.server";
import { sampleWordQuery } from "./word.query";

export const loadWord = async () => {
  const numWords = 26;
  const word = await db.words.findFirstOrThrow({
    take: 1,
    skip: Math.floor(Math.random() * numWords),
  });
  const occurrences = await db.occurrences.findMany();
  return word;
};

export const sampleWord = async () => {
  const result = await sampleWordQuery();
  return result;
};

export const logOccurrence = async (wordId: number) => {
  const occurrence = await db.occurrences.create({
    data: {
      word_id: wordId,
      last_seen: new Date(),
    },
  });
};
