import React, { Component } from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL,POSTER_SIZE, BACKDROP_SIZE } from '../../config';
import HeroImage from '../HeroImage/HeroImage';
import SearchBar from '../SearchBar/SearchBar';
import FourColGrid from '../FourColGrid/FourColGrid';
import MovieThumb from '../MovieThumb/MovieThumb';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import Spinner from '../Spinner/Spinner';
import './Home.css';

class Home extends Component {
state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: ''
    }

componentDidMount(){
    if (localStorage.getItem('HomeState')) {
        const state = JSON.parse(localStorage.getItem('HomeState'));
        this.setState({ ...state});
    } else {
    this.setState({ loading: true });
    const endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=34cf30e860e70940bccb8f4c53ee0349&language=en-UK&page=1`;
    this.fetchItems(endpoint);
    }
}

searchItems = (searchTerm) => {
let endpoint = '';
this.setState({
    movies: [],
    loading: true,
    searchTerm
})

    if(searchTerm  === ''){
        endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=34cf30e860e70940bccb8f4c53ee0349&language=en-US&page=1`;
    } else {
        endpoint = `https://api.themoviedb.org/3/search/movie?api_key=34cf30e860e70940bccb8f4c53ee0349&language=en-US&query=${searchTerm}`;
    }
    this.fetchItems(endpoint);
}

loadMoreItems = () => {
    let endpoint = '';
    this.setState({ loading: true });

    if(this.state.searchTerm === ''){
        endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=34cf30e860e70940bccb8f4c53ee0349&language=en-US&page=${this.state.currentPage + 1}`;
    } else {
        endpoint = `https://api.themoviedb.org/3/search/movie?api_key=34cf30e860e70940bccb8f4c53ee0349&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
    }
    this.fetchItems(endpoint);
}

fetchItems = (endpoint) => {
    fetch(endpoint)
    .then(result => result.json())
    .then(result => {
        this.setState({
            movies: [...this.state.movies, ...result.results],
            heroImage: this.state.heroImage || result.results[0],
            loading: false,
            currentPage: result.page,
            totalPages: result.total_pages
        }, ()=> {
            if(this.state.searchTerm === ""){
            localStorage.setItem('HomeState', JSON.stringify(this.state));
            }
        })
    })
    .catch(error => console.error('Error:', error))
}

    render() {
         return (
             <div className="rmdb-home">
             {this.state.heroImage ?
                <div>
                        <HeroImage
                         image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
                         title={this.state.heroImage.original_title}
                         text={this.state.heroImage.overview}
                         />
                     <SearchBar callback={this.searchItems} />
                    </div> : null}
                    <div className="rmdb-home-grid">
                      <FourColGrid
                      header={this.state.searchTerm ? 'Search Result' : 'Trending Movies'}
                      loading={this.state.loading}
                      >
                      {this.state.movies.map ( (element, i) => {
                          return <MovieThumb
                                  key={i}
                                  clickable={true}
                                  image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                  movieId={element.id}
                                  movieName={element.original_title}
                                  />
                                })}           
                      </FourColGrid>
                      {this.state.loading ? <Spinner /> : null}
                      {(this.state.currentPage <= this.state.totalPages && !this.state.loading) ?
                      <LoadMoreBtn text="Show More" onClick={this.loadMoreItems} />
                      : null }
                    </div>
                </div>
        )
    }
}

export default Home;
