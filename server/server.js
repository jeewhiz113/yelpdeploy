require('dotenv').config();
const express = require('express');
const app = express();  //make an instance the of express app
const cors = require('cors');
const db = require('./db');  //get the query function

app.use(cors());  //cors policy makes it that 1 domain cannot retrieve info from another, this solves that.
app.use(express.json());  //takes the body of the request and attach it under the body property of the request


const port = process.env.PORT || 3001;  //default value for port

//CRUD PATHS:

//get all restaurants:
app.get('/api/v1/restaurants', async (req, res)=>{
  //usually with an async function, wrap it in a try catch block
  try{
    //const result = await db.query("select * from restaurants");
    //get the restaurants with reviews and average rating:
    const restaurantRatingsData = await db.query("select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id");
    //console.log(result);
    console.log('restaurant review data', restaurantRatingsData)
    res.json({
      status:"success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows
      }
    })
  }catch (err) {
    console.log(err);
  }
})

//get 1 restaurant
app.get('/api/v1/restaurants/:id', async (req, res)=>{
  try{
    // const result = await db.query(`select * from restaurants where id = ${req.params.id}`);
    //To avoid sql injection attacks: replace $1 with req.params.id, never use string interpolation
    const restaurant = await db.query('select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1', [req.params.id]);
    //The general form: 'select $2 from restaurants where id = $1', [req.params.id, name], how does this work?
    const reviews = await db.query('select * from reviews where restaurant_id = $1', [req.params.id]);
    res.json({
      status:"success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows
      }
    })
  }catch (err) {
    console.log(err);
  }
})

//create a restaurant
app.post('/api/v1/restaurants', async (req, res)=>{
  console.log(req.body)
  try {
    //return * gets postgres to return the inserted values.
    const results = await db.query('INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *', [req.body.name, req.body.location, req.body.price_range]);
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0]
      }
    })
  } catch (err){
    console.log(err);
  }
});

//update a restaurant:
app.put('/api/v1/restaurants/:id', async (req, res)=>{
  console.log('info in the put route', req.body)
  try {
    //return * gets postgres to return the inserted values.
    const results = await db.query('UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *', [req.body.name, req.body.location, req.body.price_range, req.params.id]);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0]
      }
    })
  } catch (err){
    console.log(err);
  }
})

//delete a restaurant:
app.delete('/api/v1/restaurants/:id', async (req, res)=>{
  console.log('info in the put route', req.body)
  try {
    //return * gets postgres to return the inserted values.
    const results = await db.query('DELETE FROM restaurants WHERE id = $1 returning *', [req.params.id]);  //$1 is the placeholder and req.params.id is the id number
    res.status(200).json({
      status: "success"
    })
  } catch (err){
    console.log(err);
  }
})

//add a review:
app.post('/api/v1/restaurants/:id/addreview', async (req, res)=>{
  try{
    const newReview = await db.query('INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *', [req.params.id, req.body.name, req.body.review, req.body.rating]);  //do not forget to return the * so we get a proper response from db
    console.log('the addview review object looks like', newReview)
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview.rows[0],
      }
    })
  }catch(err){
    console.log(err);
  }
})

app.listen(port, ()=>{
  console.log(`Server is listening on port ${port}`);
})