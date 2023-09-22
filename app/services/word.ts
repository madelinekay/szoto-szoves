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

// assumes that weight_by_days_ago is defined:
// create or replace function weight_from_days_ago (days_ago int) returns int as $$
// begin
//   return (select 5 * coalesce(days_ago, 10) * (5 - abs(difficulty - user_level)));
// end;
// $$ language plpgsql;

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

  // const occurrence = await db.$queryRaw`
  // INSERT INTO occurrences (word_id, last_seen)
  // VALUES (wordId, new Date())
  // ON CONFLICT (word_id) DO UPDATE
  //     SET last_seen = new Date();
  // `;
};
