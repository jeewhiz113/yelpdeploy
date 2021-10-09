import React, { useEffect, useContext } from 'react'
import RestaurantFinder from '../apis/RestaurantFinder'
import { RestaurantsContext } from '../context/RestaurantsContext';
import { useHistory } from 'react-router-dom'
import StarRating from './StarRating'
const RestaurantList = (props) => {
  const {restaurants, setRestaurants} = useContext(RestaurantsContext)
  let history = useHistory();  //this history object represents the history of our browser
  useEffect(()=>{
    const fetchData = async ()=>{
      //So this is a get request from axios? How?
      try{
        const response = await RestaurantFinder.get('/'); 
        setRestaurants(response.data.data.restaurants); //set the state of the app, going to show the newly updated restaurants
      } catch (err){
        console.log(err)
      }
    }
    //call fetchdata()
    fetchData();
  }, []); //only run when component mounts

  const handleDelete = async (e, id)=>{
    e.stopPropagation();  //stop the event from bubbling up to the table row
    try {
      const response = await RestaurantFinder.delete(`/${id}`);
      console.log(response);  //no data gets returned because we are deleting something
      //Now we update the state of the app: filter out the restaurant that got deleted
      setRestaurants(restaurants.filter(res=>{ //filter out the delete restaurant
        return res.id !== id;
      }))
    } catch (err) {
      console.log(err)
    }
  }
  const handleRestaurantSelect = (id) => {
    history.push(`restaurants/${id}`);

  }
  //get react to load the history page: pay close attention to how this is done mechanically!
  const handleUpdate = (e, id)=>{
    e.stopPropagation();  //stop the event from bubbling up to the table row
    //history is an array, so push the next url here to get the browser to load that page
    history.push(`/restaurants/${id}/update`);  //this is the tail of the url after localhost
  }

  //render rating function:
  const renderRating = (res)=>{
    if (!res.count){
      return <span className="text-warning">0 reviews</span>
    }
    return (
      <>
        <StarRating rating = {res.id} />
        <span className="text-warning ml-1">({res.count})</span>
      </>
    )
  }
  return (
    <div>
      <table className = "table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 && restaurants.map(res =>{
            return (
              <tr onClick = {()=>handleRestaurantSelect(res.id)}key={res.id}>
                <td>{res.name}</td>
                <td>{res.location}</td>
                <td>{"$".repeat(res.price_range)}</td>
                <td>{renderRating(res)}</td>
                <td><button onClick = {(e)=> handleUpdate(e, res.id) }className="btn btn-warning">Update</button></td>
                <td><button onClick = {(e) => handleDelete(e, res.id)} className="btn btn-danger">Delete</button></td>
              </tr>
            )
          })}

        </tbody>
      </table>
    </div>
  )
}

export default RestaurantList
