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

export const logOccurrence = async (wordId: number) => {
  const occurrence = await db.occurrences.create({
    data: {
      word_id: wordId,
      last_seen: new Date(),
    },
  });
};

// const result = await prisma.$queryRaw`
//   with latest_asks as (
//     select
//       id,
//       question_id,
//       last_seen,
//       now() - date_seen as time_ago
//     from
//       occurrences
//   ),
//   result as (
//     select
//       w.*,
//       extract(
//         epoch
//         from
//           (
//             date_trunc('day', la.last_seen)
//           )
//       ):: int as milliseconds_ago
//     from
//       words
//       left join latest_asks la on w.id = la.word_id
//   )
//   select
//     *,
//     weight_from_days_ago(days_ago) as weight
//   from
//     result;
// `;
