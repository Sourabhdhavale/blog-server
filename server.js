require('dotenv').config();
const express = require('express')
const cors = require('cors')
const config = require('./config')
const utils = require('./utils')
const jwt = require('jsonwebtoken');

const app = express()
app.use(cors({
  origin: ['https://blog-client-o9detk0bb-sourabhs-projects-8f523db4.vercel.app/'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json())

app.use((request, response,next) => {
  //Check if token is required for API
  console.log("Reuqest URl: "+request.url);
  if (request.url === '/user/login' || request.url === '/user/register') {
    //skip verifying token
    next();
  } 
  else {
    console.log("request header:"+request.headers.token);
    //Get a token
    const token = request.headers['token'];

    if (!token || token.length === 0) {
      console.log("payload id:" +token);

      response.send(utils.createErrorResult('Missing token!'));
    }
    else {
      try {
        //verify token
        const payload = jwt.verify(token, config.secret)
        //Add u ser id to the request
        console.log("payload id:"+payload.id);
        request.id = payload['id'];
      
        //call the next route
        next();
      }
      catch (error) {
        //Token expiry logic
        if (error.name === 'TokenExpiredError') {
          response.status(401).send(utils.createErrorResult("Token expired!"));
        }
        else {
          response.send(utils.createErrorResult("Invalid Token!"));
        }
      }
    }
  }
})
// add the routes
const userRouter = require('./router/user')
const categoryRouter = require('./router/category')
const blogRouter = require('./router/blogs')

app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/blog', blogRouter )

app.listen(4000, '0.0.0.0', () => {
  console.log(`server started on port 4000`)
})
