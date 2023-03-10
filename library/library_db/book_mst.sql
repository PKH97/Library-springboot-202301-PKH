select * from book_mst order by publication_date;

update book_mst
set publication_date = date_format('2010-11-23', '%Y-%m-%d')
where publication_date ='2110-11-23';

SELECT
	*
from
	book_mst
where
	1=1
/*
and (
		book_name like '%사용%'
	or author like '%사용%'
    or publisher like '%사용%'
	)
*/
and category = '소설'
order by
	#book_name,
    #author
    #publication_date,
    publication_date desc,
	book_id
#limit 0, 20
;


create view test as
select
	username,
    name
from
	user_mst;


create view categorycategory_view_view as
select
	row_number() over(order by category) as category_id,
    category
from
	book_mst
group by
	category;
    

drop view test;
    


