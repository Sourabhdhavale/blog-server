const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

// Create blog
router.post('/createBlog', (request, response) => {
    const { title, content, userId, categoryId } = request.body
    const statement = `insert into blogs(title, content, user_id, category_id) values (? ,?, ?, ?);`
  
    db.pool.execute(
      statement,
      [title, content, userId, categoryId],
      (error, result) => {
        response.send(utils.createResult(error, result))
      }
    )
  })

// Edit blog
router.put('/editBlog', (request, response) => {
    const { blogId, title , content,categoryId} = request.body
    const statement = `update blogs set title = ?, content = ?, category_id=? where blog_id = ?`;

      db.pool.execute(
        statement,
        [title,content,categoryId,blogId],
        (error, result) => {
          response.send(utils.createResult(error, result))
        }
      )
    })

// Search blog
router.get('/searchBlog', (request, response) => {
  console.log("title: " + request.query.blogTitle);
  const bTitle = request.query.blogTitle;
    
  if (!bTitle || bTitle.trim() === '') {
      return response.status(400).send(utils.createErrorResult('Please provide a search term.'));
  }
  const statement = `select b.blog_id, b.title as blog_title, COALESCE(c.title, 'Uncategorized') AS category_title from blogs b left join categories c on b.category_id = c.category_id where b.title LIKE ? order by b.blog_id`
  db.pool.query(statement, [`%${bTitle}%`], (error, blogs) => {
    console.log("Get searched blogs in router: " + blogs);
    console.log("Get searched blogs error in router: "+error);

    response.send(utils.createResult(error, blogs))
  })
})
// Delete blog
router.delete('/deleteBlog', (request, response) => {
      console.log("In express delete blog:"+request.query.blogId);
      const statement = `delete from blogs where blog_id = ?`
      db.pool.execute(
        statement,[request.query.blogId],
        (error, result) => {
          console.log("result:"+result);
          response.send(utils.createResult(error, result))
        }
      )
    })


router.get('/getMyBlogs', (request, response) => {
  const statement = `select b.blog_id, b.title as blog_title, COALESCE(c.title, 'Uncategorized') AS category_title from blogs b join categories c on b.category_id = c.category_id where b.user_id = ? order by b.blog_id`
  db.pool.query(statement, [request.query.userId], (error, blogs) => {
    // console.log(blogs);
    response.send(utils.createResult(error, blogs))
  })
})


router.get('/getAllBlogs', (request, response) => {
  const statement = `select b.blog_id, b.title as blog_title, COALESCE(c.title, 'Uncategorized') AS category_title from blogs b left join categories c on b.category_id = c.category_id order by b.blog_id`;
  db.pool.query(statement, (error, categories) => {
    console.log("Get alll blogs in router epxress:"+ categories);
      response.send(utils.createResult(error, categories))
    })
  })

router.get('/getBlogDetails', (request, response) => {  
  const statement = `select blog_id,title,content,category_id from blogs where blog_id=?`;
  db.pool.query(statement, [request.query.blogId], (error, blog) => {
    console.log("blog details:" +blog)
    response.send(utils.createResult(error,blog))
  })
})
  

module.exports = router
