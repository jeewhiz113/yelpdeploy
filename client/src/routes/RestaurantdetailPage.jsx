import React, { useContext, useEffect }from 'react'
import { useParams } from 'react-router'
import RestaurantFinder from '../apis/RestaurantFinder';
import { RestaurantsContext } from '../context/RestaurantsContext';
import Reviews from '../components/Reviews';
import AddReview from '../components/AddReview';
import StarRating from '../components/StarRating';
function RestaurantdetailPage() {
  const {selectedRest, setSelectedRest} = useContext(RestaurantsContext)
  const {id} = useParams();

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await RestaurantFinder.get(`/${id}`)
        console.log(response.data.data)
        setSelectedRest(response.data.data);
      }catch (err){
        console.log(err)
      }
    };
    fetchData();
  }, [])
  return (
    <div>
      {selectedRest && (
        <>
          <h1 className="text-center display-1">{selectedRest.restaurant.name}</h1>
          <div className = "text-center">
            <StarRating rating={selectedRest.restaurant.average_rating}/>
            <span className="text-warning ml-1">
              {selectedRest.restaurant.count ? `(${selectedRest.restaurant.count})` : "(0)"}
            </span>
          </div>
          <div className="mt-3">
            <Reviews reviews = {selectedRest.reviews}/>
          </div>
          <div>
            <AddReview />
          </div>
        </>
      )}
    </div>
  )
}

export default RestaurantdetailPage
