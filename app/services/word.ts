import { db } from "~/utils/db.server";

export const loadWord = async () => {
  const numWords = 26;
  const word = await db.words.findFirstOrThrow({
    take: 1,
    skip: Math.floor(Math.random() * numWords),
  });
  const occurrences = await db.occurrences.findMany();
  console.log("occurrences", occurrences);
  return word;
};

// assumes that weight_by_days_ago is defined:
// create or replace function weight_from_days_ago (days_ago int) returns int as $$
// begin
//   return (select 5 * coalesce(days_ago, 10) * (5 - abs(difficulty - user_level)));

// end;
// $$ language plpgsql;
//figure out what's happening with words seen most recently
export const sampleWord = async () => {
  const result = await db.$queryRaw`
  with latest_asks as (
    select
      word_id,
      max(last_seen) as last_seen
    from
      occurrences
    group by word_id
  ),
  result as (
    select
      w.*,
      extract(
      epoch 
      from 
        (
          date_trunc('day', now() - la.last_seen)
        )/ 86400
    ):: int as days_ago 
    from
      words w
      left join latest_asks la on w.id = la.word_id
  )
  select
    *,
    weight_from_days_ago(days_ago, difficulty, 1) as weight
  from
    result;
`;
  return result;
};
//need to overwrite
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
