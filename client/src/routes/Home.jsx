import React from 'react'
import AddRestaurant from '../components/AddRestaurant'
import Header from '../components/Header'
import RestaurantList from '../components/RestaurantList'

function Home() {
  return (
    <div>
      <h3>Check why deleting restaurant does not work?!?!?!?!!</h3>
      <Header/>
      <AddRestaurant/>
      <RestaurantList/>
    </div>
  )
}

export default Home
