import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

// Componente restaurado a su funcionalidad original con fetchs y rutas nativas
const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  let params = useParams();
  let id = params.id;
  // Usamos rutas relativas para evitar conflictos con el proxy de Django
  let dealer_url = `/djangoapp/dealer/${id}`;
  let reviews_url = `/djangoapp/reviews/dealer/${id}`;
  
  const get_dealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) setDealer(retobj.dealer[0]);
  }

  const get_reviews = async () => {
    const res = await fetch(reviews_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      retobj.reviews.length > 0 ? setReviews(retobj.reviews) : setUnreviewed(true);
    }
  }

  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
  }

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(<a href={`/postreview/${id}`}><img src={review_icon} style={{ width: '10%', marginLeft: '10px' }} alt='Post Review' /></a>)
    }
  }, []);  

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>{dealer.full_name}{postReview}</h1>
        <h4 style={{ color: "grey" }}>{dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state} </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed && <span>Loading Reviews....</span>}
        {unreviewed && <div>No reviews yet! </div>}
        {reviews.map(review => (
          <div className='review_panel' key={review.id}>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
            <div className='review'>{review.review}</div>
            <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
          </div>
        ))}
      </div>  
    </div>
  )
}

export default Dealer;
