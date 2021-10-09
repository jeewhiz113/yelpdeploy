import React from 'react'

const StarRating = ({rating}) => {  //props is the rating i.e. the numberof stars
  const stars = [];
  for (let i = 1; i <= 5; i++){
    if (i <= rating){
      stars.push(<i key={i} className="fas fa-star"></i>);
    }else if (!Number.isInteger(rating) && i === Math.ceil(rating)){
      stars.push(<i key={i} className="fas fa-star-half-alt"></i>)
    }else {
      stars.push(<i key={i} className="far fa-star"></i>);
    }
  }
  return <>{stars}</>
  
}

export default StarRating
