const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

// Show categories
router.get('/showCategories', (request, response) => {
  const statement = `select category_id, title from categories;`
  db.pool.query(statement, (error, categories) => {
    response.send(utils.createResult(error, categories))
  })
})

// Add categories
router.post('/addCategory', (request, response) => {
  const { title} = request.body
  const statement = `insert into categories(title) values (?);`

  db.pool.execute(
    statement,
    [title],
    (error, result) => {
      response.send(utils.createResult(error, result))
    }
  )
})

// Delete category
router.delete('/deleteCategory', (request, response) => {
  const updateStatement = `UPDATE blogs SET category_id = NULL WHERE category_id = ?`;
  
  db.pool.execute(updateStatement, [request.query.categoryId], (error, result) => {
    const deleteStatement = 'delete from categories where category_id=?'
    if (error) {
      response.send(utils.createErrorResult(error));
    }
    else {
      db.pool.execute(deleteStatement, [request.query.categoryId], (error, result) => {
        response.send(utils.createResult(error, result));
      })
    }
  })
})

module.exports = router
