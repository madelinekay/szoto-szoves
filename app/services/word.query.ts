import { db } from "~/utils/db.server";

export const sampleWordQuery = () => db.$queryRaw`
with latest_roots as (
    select
    r.id,
    coalesce(
      SUM(extract(epoch from date_trunc('day', now() - la.last_seen) / 86400)),
      (select extract(epoch from date_trunc('day', now() - last_seen) / 86400) from test_latest_asks order by last_seen asc)
    ) :: int as root_score
    from test_roots r
    left join test_connections c on r.id = c.root_id 
    left join test_latest_asks la on c.word_id = la.word_id
    group by r.id
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
