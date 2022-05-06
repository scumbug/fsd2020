#Playing with Northwind DB

##SQL view creation
Express server will pull data directly from the view instead of the tables

```
CREATE VIEW order_totals as
SELECT
	o.id as order_id,
	o.order_date as date,
	o.customer_id as customer_id,
	SUM(od.quantity) as total_quantity,
	SUM(od.quantity * od.unit_price) as total_price,
	SUM(od.quantity * od.discount) as total_discount,
	SUM(od.quantity * p.standard_cost) as total_cost
FROM orders o
JOIN order_details od
ON od.order_id = o.id
JOIN products p
ON p.id = od.product_id
GROUP BY o.id
```
