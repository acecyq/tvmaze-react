// home page only displays everything and has no need for states or properties
function Home() {
      
  return (
    <div>
      <h1 className="text-center">TV MAZE</h1>
      <SearchContainer />
    </div>
  );

}

// function runs through .show.name of every element in results.js and checks if the lowercase of it includes the word in this.state.query
function findMovies(results, query) {
  var foundMovies = [];
  for (var i = 0; i < results.length; i++) {
    if (results[i].show.name.toLowerCase().includes(query)) {
      foundMovies.push(results[i]);
    }
  }
  return foundMovies;
}

// function generates random integer from 0 - 255
function mr() {
  return Math.floor(Math.random() * 256);
}

// search container is a container for search
class SearchContainer extends React.Component {
  constructor() {
    super();
    this.changeHandler = this.changeHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.imageLink = this.imageLink.bind(this);
  }

  state = {
    query : "",
    movies : [],
    color : "",

    // not sure how to use hasSearched
    hasSearched : false
  }

  changeHandler(event) {
    var col0 = mr();
    var col1 = mr();
    var col2 = mr();
    var newColor = "rgb(" + col0 + ", " + col1 + ", " + col2 + ")";

    this.setState( { 
      query : event.target.value,
      color : newColor
    } );
  }

  // sending AJAX request for show titles
  async clickHandler(event) {

    //await the response of the fetch call
    let response = await fetch('http://api.tvmaze.com/search/shows?q=' + this.state.query);

    //proceed once the first promise is resolved.
    let data = await response.json();

    //proceed only when the second promise is resolved
    this.setState( { movies : data } );
  }

  // sending AJAX request for cast of the chosen show
  async imageLink(id) {

    //await the response of the fetch call
    let response = await fetch('http://api.tvmaze.com/shows/' + id + '/cast');

    //proceed once the first promise is resolved.
    let data = await response.json();

    //proceed only when the second promise is resolved
    this.setState( { movies : data } );
  }

  render() {
    return (
      <div style={{ border : "thick solid " + this.state.color }}>
        <Search 

          // passes changeHandler, clickHandler methods to Search component
          change={this.changeHandler} 
          click={this.clickHandler}

          // passes movies array into Search component
          movies={this.state.movies}

          // passes imageLink method into Search component
          imageLink={this.imageLink}
        />
      </div>
    );
  }

}

// using function instead of component for Search. contains input, search button and the results.
function Search(props) {
  return (
    <div className="container">
        <div className="row">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">Show Title</span>
            </div>
            <input onChange={props.change} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>
          <br/>
        </div>
        <div className="row justify-content-md-center" style={{textAlign: "center"}}>
            <button 
              onClick={props.click}
              className="btn btn-danger btn-lg"
              type="button"
            >
              Search
            </button>
        </div>

        <br/>
        <br/>
        <Results 
          movie={props.movies}
          findCast={props.imageLink}
        />
      </div>
  )
}

// using function instead of components. if show has image, render result with image. if there is no result return "no result".
function Results(props) {
  var ending;
  if (props.movie) {
    ending = props.movie.map((el, index) => {
      if (el.show) {
        if (el.show.image) {
          return (
            <Result 
              key={index} 
              image={el.show.image.medium} 
              name={el.show.name}
              link={el.show.id}
              cast={props.findCast}
            />
          );
        } else {
          return (
            <Result
              key={index}
              image=""
              name={el.show.name}
              link={el.show.id}
              cast={props.findCast}
            />
          );
        }
      } else {
        return (
          <Result 
            key={index} 
            image={el.person.image.medium} 
            name={el.person.name}
          />
        );
      }
    });
  } else {
    ending = <p>Sorry there are no results.</p>
  }
  return (
    <div className="row">
      {ending}
    </div>
  );
}

// using function instead of components
function Result(props) {
  return (
    <div className="col-sm-3">
      <img id={props.link} className="mx-auto d-block" src={props.image} onClick={() => props.cast(props.link)} />
      <p className="text-center">{props.name}</p>
    </div>
  )
}

ReactDOM.render(
  <Home/>,
  document.getElementById('root')
);

