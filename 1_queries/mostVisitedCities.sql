SELECT city,
COUNT (reservations) AS total_reservations

FROM properties

INNER JOIN reservations
ON properties.id = reservations.property_id

GROUP BY 1

ORDER BY total_reservations DESC;