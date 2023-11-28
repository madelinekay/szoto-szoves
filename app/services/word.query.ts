import { db } from "~/utils/db.server";
// will unseen roots be calculated here? unnecessary work
export const sampleWordQuery = () => db.$queryRaw`
with latest_roots as (
  SELECT
    r.id,
    SUM(
        EXTRACT(epoch FROM date_trunc('day', NOW() - COALESCE(la.last_seen, (
            SELECT min(last_seen) - INTERVAL '1 day' from latest_asks
        ))) / 86400)
    )/COUNT(c.root_id)::INT AS root_score 
  FROM
      roots r
  LEFT JOIN
      connections c ON r.id = c.root_id 
  LEFT JOIN
      latest_asks la ON c.word_id = la.word_id
  GROUP BY
      r.id;
  ),
  result as (
    select
      w.id,
    	w.word,
    	w.difficulty,
    	(SUM(lr.root_score)/COUNT(c.word_id))::int as root_score,
      extract(epoch from (date_trunc('day', now() - la.last_seen))/ 86400):: int as days_ago
    from
      words w
    left join latest_asks la on w.id = la.word_id
    inner join connections c on w.id = c.word_id
    inner join latest_roots lr on lr.id = c.root_id
    group by w.id, la.last_seen
  )
  select
		*,
    weight_from_days_ago(days_ago, difficulty, 1, root_score) as weight
  from 
    result;
`;
