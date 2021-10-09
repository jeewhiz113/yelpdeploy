import React, {useState, createContext} from "react";

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = props => {
  //store the list of restaurants:
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRest, setSelectedRest] = useState(null);
  const addRestaurants = (restaurant)=>{
    console.log("running add Restaurant in the context function")
    setRestaurants([...restaurants, restaurant])
  }
  //All the children of this component gets the restaurants and also the function to set the restaurants
  return (
    <RestaurantsContext.Provider value = {{restaurants, setRestaurants, selectedRest, setSelectedRest, addRestaurants}}>
      {props.children}
    </RestaurantsContext.Provider>
  )
}