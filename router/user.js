const express = require('express')
const db = require('../db')
const utils = require('../utils')
const config = require('../config')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const router = express.Router()
router.post('/register', (request, response) => {
  const { name, email, password, phone } = request.body
  const statement = `insert into user (name, email, password, phone) values (?, ?, ?, ?);`
  const encryptedPassword = String(crypto.SHA256(password));
  db.pool.execute(
    statement,
    [name, email, encryptedPassword, phone],
    (error, result) => {
      response.send(utils.createResult(error, result));
    }
  )
})

router.post('/login', (request, response) => {
  const { email, password } = request.body;
  const statement = `select id, name, phone from user where email = ? and password = ?`
  const encryptedPassword = String(crypto.SHA256(password))
  db.pool.query(statement, [email, encryptedPassword], (error, users) => {
    console.log("In login user: "+JSON.stringify(users));
    if (error) {
      response.send(utils.createErrorResult(error))
    }
    else {
      if (users.length == 0) {
        response.send(utils.createErrorResult('User does not exist!'));
      }
      else {
        const user = users[0];
        const payload = { id: user.id };
        const token = jwt.sign(payload, config.secret,{expiresIn:'1d'});
        const userData = {
          token,
          id:`${user.id}`,
          name: `${user.name}`
          
        }
      response.send(utils.createSuccessResult(userData));
      }
    }
  }
  )
})


module.exports = router
