import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import RestaurantFinder from '../apis/RestaurantFinder';

const UpdateRestaurant = (props)=> {
  //useParams allows us to get the id in the url
  const { id } = useParams();  //test is an object from the url with :name
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  let history = useHistory();
  useEffect(()=>{
    const fetchData = async ()=>{
      //So this is a get request from axios? How?
      try{
        const response = await RestaurantFinder.get(`/${id}`);
        console.log(response)
        setName(response.data.data.restaurants.name)
        setLocation(response.data.data.restaurants.location)
        setPriceRange(response.data.data.restaurants.price_range)
      } catch (err){
        console.log(err)
      }
    }
    fetchData();
  }, []); //only run when component mounts
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const updatedRestaurant = await RestaurantFinder.put(`/${id}`, {
        name, location, price_range: priceRange
      });
      console.log(updatedRestaurant)
      history.push('/')
    } catch (err){
      console.log(err)
    }
  }
  return (
    <div>
      <form action="">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" value  = {name} onChange = {e => setName(e.target.value)} className="form-control" type="text"/>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" value  = {location} onChange = {e => setLocation(e.target.value)}className="form-control" type="text"/>
        </div>
        <div className="form-group">
          <label htmlFor="price_range">Price Range</label>
          <input id="price_range" value  = {priceRange} onChange = {e => setPriceRange(e.target.value)}className="form-control" type="number"/>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary">Update</button>
      </form>
    </div>
  )
}


export default UpdateRestaurant
