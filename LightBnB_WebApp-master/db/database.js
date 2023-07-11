const { query } = require("express");
const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

//connecting to lightbnb database
const pool = new Pool({
  user: 'mattyu',
  password: 'password',
  host: 'localhost',
  database: 'lightbnb'
});

//Function pulls the users info based on the email address provided
const getUserWithEmail = function(email) {
  const queryCode = 
  ` 
  SELECT *
  FROM users
  WHERE email = $1;
  `
  return pool
    .query(queryCode, [email])
    .then((res) => {
      return res.rows[0]
    })
    .catch(err => {
      console.log("there is an error", err)
    })
}

//Get users info with their user id 
const getUserWithId = function(id) {
  const queryCode = 
  `
  SELECT *
  FROM users
  WHERE id = $1;
  `

  return pool
    .query(queryCode, [id])
    .then(res => {
      return res.rows[0]
    })
    .catch(err => {
      console.log("there is an error", err)
    })
}

//Function that adds a new user to the database
const addUser = function(user) {
  const name = user.name
  const email = user.email
  const password = user.password

  const queryCode = 
  `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `

  return pool
    .query(queryCode, [name, email, password])
    .then(res => {
      console.log(res.rows)
      return res.rows[0];
    })
    .catch(err => {
      console.log("there is an error", err)
    })
}

/// Reservations
//function that pulls a guests reservation info based on their ID 
const getAllReservations = function(guest_id, limit=10) {
  const queryCode = `
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

  WHERE reservations.guest_id = $1

  GROUP BY properties.id, reservations.id

  ORDER BY reservations.start_date 

  LIMIT $2;
  `
  return pool.query(queryCode, [guest_id, limit])
    .then(res => {
      return res.rows;
    })
    .catch(err => {
      console.log("There is an error", err)
    })
}

//New getAllProperties function - This will dynamically filter out the code 
const getAllProperties = function(options, limit = 10) {
  const run = `
  SELECT properties.id,
  title,
  cost_per_night,
  AVG(property_reviews.rating) AS average_rating

  FROM properties

  INNER JOIN property_reviews
  ON properties.id = property_reviews.property_id

  WHERE city = 'Vancouver'

  GROUP BY properties.id

  HAVING AVG(property_reviews.rating) >= 4

  ORDER BY cost_per_night ASC

  LIMIT 10;
  `

  return pool
    .query(run)
    .then()
    .catch((err) => {
      console.log("There is an error", err)
    })
}


/// Properties
//function that pulls the list of all the properties -- Old code for getAll Properties
// const getAllProperties = function(options, limit = 10) {
//   const run = `
//   SELECT *
//   FROM properties
//   LIMIT $1
//   `
//   return pool
//     .query(run, [limit])
//     .then((res) => {
//       return res.rows;
//       }
//     )
//     .catch((err) => {
//       console.log("There is an error", err);
//     })
//   };

//Function that will add a new item to properties
const addProperty = function (property) {
  const title = property.title
  const description = property.description
  const thumbnail_photo_url = property.thumbnail_photo_url
  const cover_photo_url = property.cover_photo_url
  const cost_per_night = property.cost_per_night
  const street = property.street
  const city = property.city
  const province = property.province
  const post_code = property.post_code
  const country = property.country
  const parking_spaces = property.parking_spaces
  const number_of_bathrooms = property.number_of_bathrooms
  const number_of_bedrooms = property.number_of_bedrooms

  const queryCode = 
  `
  INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING *;
  `

  return pool
    .query(queryCode, [title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.log("There is an error", err)
    })
}

///OLD ADD NEW PROPERTY FUNCTION

// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function (property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
