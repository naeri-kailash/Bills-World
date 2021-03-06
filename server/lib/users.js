const config = require('../../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(config)

module.exports = {
  getUsers,
  createUser,
  exists,
  getByUserId
}

function getUsers () {
  return knex('users')
  .select()
  .catch((err) => {
    if (err) {
      console.error(err.message)
    }
  })
}

function createUser (user_id, username, email, testDb) {
  const connection = testDb || knex
  return connection('users')
    .insert({
      user_id: user_id,
      username: username,
      email: email
    })
    .catch((err) => {
      if (err) {
        console.error(err.message)
      }
    })
}

function exists (user_id, testDb) {
  const connection = testDb || knex
  return connection('users')
    .count('id as n')
    .where('user_id', user_id)
    .then(count => {
      return count[0].n > 0
    })
    .catch((err) => {
      if (err) {
        console.error(err.message)
      }
    })
}

function getByUserId (user_id, testDb) {
  const connection = testDb || knex
  return connection('users')
    .where('user_id', user_id)
    .select()
    .catch((err) => {
      if (err) {
        console.error(err.message)
      }
    })
}
