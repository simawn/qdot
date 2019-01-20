import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
 
class App extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      rating: this.props.rating || null
    };
  }
 
  onStarClick(nextValue, prevValue, name) {
    if(prevValue){
      this.setState({rating: nextValue});
      axios.put('/user', {
        placeName: 'Fivespan'
        userID: '5c43dacaf811591dd04b1aa6'
        rating: nextValue
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
    axios.post('/user', {
      placeName: 'Fivespan'
      userID: '5c43dacaf811591dd04b1aa6'
      rating: nextValue
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    }
  }

  render() {
    const { rating } = this.state;
    
    return (                
      <div>
        <h3>How is this place? : {rating} </h3>
        <StarRatingComponent 
          name="rate1" 
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        />
      </div>
    );
  }
}
 
ReactDOM.render(
  <App />, 
  document.getElementById('app')
);