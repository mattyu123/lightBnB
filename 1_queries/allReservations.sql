SELECT reservations.id,
properties.*,
reservations.start_date,
reservations.end_date,
AVG(property_reviews.rating) AS average_rating

FROM reservations

INNER JOIN properties
ON reservations.property_id = properties.id

INNER JOIN property_reviews
ON property_reviews.property_id = properties.id

WHERE reservations.guest_id = 1

GROUP BY properties.id, reservations.id

ORDER BY reservations.start_date 

LIMIT 10;
