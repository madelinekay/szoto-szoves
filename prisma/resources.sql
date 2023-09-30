create or replace view latest_asks as (
    select
        word_id,
        max(last_seen) as last_seen
    from
        occurrences
    group by word_id
);


create or replace function weight_from_days_ago (days_ago int, difficulty int, user_level int, root_score int)
returns int as $$
declare
  avg_days_ago decimal;
begin
  select avg(extract(
      epoch 
      from 
        (
          date_trunc('day', now() - la.last_seen)
        )/ 86400
    ))
  from latest_asks la into avg_days_ago;
  
	return (select coalesce(days_ago, 0)) / avg_days_ago + abs(difficulty - user_level) + root_score;
end;
$$ language plpgsql;