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
      console.log(res.rows)
      return res.rows
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

// /**
//  * Add a new user to the database.
//  * @param {{name: string, password: string, email: string}} user
//  * @return {Promise<{}>} A promise to the user.
//  */
// const addUser = function (user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// };

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const run = `
SELECT *
FROM properties
LIMIT $1
`

//function that pulls the list of all the properties
const getAllProperties = function(options, limit = 10) {
  return pool
    .query(run, [limit])
    .then((res) => {
      return res.rows;
      }
    )
    .catch((err) => {
      console.log("There is an error", err);
    })
  };


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
