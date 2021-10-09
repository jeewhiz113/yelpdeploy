import React, { useState } from 'react'
import { useLocation, useParams, useHistory } from 'react-router'
import RestaurantFinder from '../apis/RestaurantFinder'

const AddReview = () => {
  const {id} = useParams(); 
  const history = useHistory();
  const location = useLocation();
  const [name, setName] = useState("")
  const [review, setReview] = useState("")
  const [rating, setRating] = useState("1")  //set the initial value here, cause if not, then integer is null, causing a bug.
  const handleSubmitReview = async (e) =>{
    e.preventDefault();
    const newReview = await RestaurantFinder.post(`/${id}/addreview`, {
      name, review, rating
    });
    history.push('/');  //this is not a very good way of fixing this, but idea: go to home page, then go back to this page
    history.push(location.pathname);
  }
  return (
    <div className="mb-2">
      <form action="">
        <div className="form-row">
          <div className="form-group col-8">
            <label htmlFor="name">Name</label>
            <input value = {name} onChange = {e => setName(e.target.value)} type="text" id="name" placeholder="name" className="form-control"/>
          </div>
          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <select value = {rating} onChange = {e => setRating(e.target.value)} id="rating" className="custom-select">
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option vallue="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Review">Review</label>
          <textarea value = {review} onChange = {e => setReview(e.target.value)} id="Review" className="form-control"></textarea>
        </div>
        <button type="submit" onClick={handleSubmitReview} className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
export default AddReview;





