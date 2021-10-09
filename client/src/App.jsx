import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import RestaurantdetailPage from './routes/RestaurantdetailPage'
import Home from './routes/Home'
import UpdatePage from './routes/UpdatePage'
import { RestaurantsContextProvider } from './context/RestaurantsContext'
const App = () =>{
  return (
    // Now check context provider in component in the console and within component, we see the state is an empty array, what we set the state to be initially
    <RestaurantsContextProvider>  
      <div className="container">
        <Router>
          {/* Switch makes it so once a route is matched, then stop looking down the list */}
          <Switch>  
            <Route exact path="/" component = {Home}/>
            <Route exact path="/restaurants/:id/update" component = {UpdatePage}/>
            <Route exact path="/restaurants/:id" component = {RestaurantdetailPage}/>
          </Switch>

        </Router>
      </div>
    </RestaurantsContextProvider>
  )
}

export default App;