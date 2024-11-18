import { dbProvider } from './DBprovider.js';

// Component chung được định nghĩa trong app.js
const MovieSlider = {
    props: {
      title: String, // Tên của slider (Most Popular, Top Rated, ...)
      sliderId: String, // ID duy nhất của slider
      movies: Array, // Danh sách phim
    },
    data() {
      return {
        hoveredMovie: null, // Phim đang hover
      };
    },
    template: `
      <div class="movie-slider-section">
        <h3>{{ title }}</h3>
        <div class="position-relative">
          <!-- Movie Slider Container -->
          <div :id="sliderId" class="row m-5 justify-content-center">
            <div
              class="col-4 slider-item text-center"
              v-for="(movie, index) in movies"
              :key="index"
              @mouseover="hoveredMovie = index"
              @mouseleave="hoveredMovie = null"
              @click="$emit('movieselected', movie.id)">
              <div class="card h-100 justify-content-center">
                <img
                  :src="movie.image"
                  alt="Movie Poster"
                  class="rounded img-fluid"
                  style="object-fit: cover; height: 444px; ">
                <!-- Movie Info on Hover -->
                <div class="card-movie-body" v-if="hoveredMovie === index">
                  <h5 class="card-title">{{ movie.fullTitle }}</h5>
                  <p>
                    <strong>ImDb:</strong> {{ movie.imDbRating }} - 
                    <strong>Count:</strong> {{ movie.imDbRatingCount }}
                  </p>
                  <p>
                    <strong>Rank:</strong> {{ movie.rank }} - 
                    <strong>Crew:</strong> {{ movie.crew }}
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Navigation Buttons -->
          <button
            class="btn position-absolute top-50 start-0 translate-middle-y"
            @click="$emit('prevslide')">
            <i class="fas fa-chevron-left"></i>
          </button>
  
          <button
            class="btn position-absolute top-50 end-0 translate-middle-y"
            @click="$emit('nextslide')">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `,
};

const app = Vue.createApp({
    data() {
        return {
            isDarkMode: localStorage.getItem('theme') === 'ligth' || !localStorage.getItem('theme'), 
            currentRevenueMoviePage: 1, 
            perRevenueMoviePage: 1, 
            hovered: null, 
            revenueMovies: [],
            //
            currentPopularMoviePage: 1, 
            perPopularMoviePage: 3, 
            popularMovies: [], 
            //
            currentTopRatedMoviePage: 1, 
            perTopRatedMoviePage: 3, 
            topRatedMovies: [], 
            //
            selectedMovie: null, 
            selectedActor: null,
            //
            searchText: '', 
            searchResults: [], 
            currentSearchPage: 1, 
            perSearchPage: 9, 
            totalSearchPages: 0, 
            isSearchPage: false, 
            //
            currentMovieActorPage: 1, 
            perMovieActorPage: 9, 
            totalMovieActorPages: 0,
            //
            isLoading: false,
        };
    },
    computed: {},
    methods: {
        toggleTheme() {
            const theme = this.isDarkMode ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            this.applyTheme();
        },

        applyTheme() {
            const htmlElement = document.documentElement;
            const theme = this.isDarkMode ? 'dark' : 'light';

            htmlElement.setAttribute('data-bs-theme', theme);

            document.body.classList.toggle('dark-mode', this.isDarkMode);
            document.body.classList.toggle('light-mode', !this.isDarkMode);
        },

        //show movies details
        async showMovieDetails(id) {
            const data = await dbProvider.fetchData(`detail/movie/${id}`);
            console.log(data);
            this.selectedMovie = data;
        },

        async showActorDetails(data) {
            this.selectedActor = data;
        },

        async backToHome() {
            this.isLoading = true; 
            
            setTimeout(() => {
                this.selectedMovie = null;
                this.isSearchPage = false; 
                this.isLoading = false; 
            }, 1000);
        },

        convertListToString(list, property) {
            return list.map(item => item[property]).join(", ");
        },

        // Fetch Most Top Revenue Movies
        async fetchRevenueMovies(page) {
            try {
                const data = await dbProvider.fetchData(`get/movie/?per_page=${this.perRevenueMoviePage}&page=${page}`);
                this.revenueMovies = data.items;
                console.log( this.revenueMovies[0])
                this.totalSlides = 5;
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        },

        async prevRevMoviesSlide() {
            if (this.currentRevenueMoviePage > 1) {
                this.currentRevenueMoviePage--;
                await this.fetchRevenueMovies(this.currentRevenueMoviePage);
            }
        },
        
        async nextRevMoviesSlide() {
            if (this.currentRevenueMoviePage < this.totalSlides) {
                this.currentRevenueMoviePage++;
                await this.fetchRevenueMovies(this.currentRevenueMoviePage);
            }
        },

        // Fetch Most Popular Movies
        async fetchPopularMovies(page) {        
            try {            
                const data = await dbProvider.fetchData(`get/mostpopular/?per_page=${this.perPopularMoviePage}&page=${page}`);
                this.popularMovies = data.items;
            } catch (error) {
                console.error('Error fetching popular movies:', error);
            }
        },

        async prevPopularMoviesSlide() {
            if (this.currentPopularMoviePage > 1) {
                this.currentPopularMoviePage--;
                await this.fetchPopularMovies(this.currentPopularMoviePage);
            }
        },

        async nextPopularMoviesSlide() {
            if (this.currentPopularMoviePage < this.totalSlides) {
                this.currentPopularMoviePage++;
                await this.fetchPopularMovies(this.currentPopularMoviePage);
            }
        },

        // Fetch Top Rated Movies
        async fetchTopRatedMovies(page) {
            try {
                const data = await dbProvider.fetchData(`get/top50/?per_page=${this.perTopRatedMoviePage}&page=${page}`);
                this.topRatedMovies = data.items;
            } catch (error) {
                console.error('Error fetching top-rated movies:', error);
            }
        },

        prevTopRatedMoviesSlide() {
            if (this.currentTopRatedMoviePage > 1) {
                this.currentTopRatedMoviePage--;
                this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
            }
        },

        nextTopRatedMoviesSlide() {
            if (this.currentTopRatedMoviePage < this.totalSlides) {
                this.currentTopRatedMoviePage++;
                this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
            }
        },

        // Handle search input and fetch search results
        async handleSearchInput() {
            if (!this.searchText.trim()) {
                alert('Vui lòng nhập từ khóa tìm kiếm!');
                return;
            }
            this.isSearchPage = true; // Chuyển sang trạng thái trang tìm kiếm
            this.selectedMovie = null;
            this.currentSearchPage = 1; // Bắt đầu từ trang 1
            await this.fetchSearchResults(this.searchText, this.currentSearchPage);
        },
    
        async fetchSearchResults(keyword, page) {
            try {
                const data = await dbProvider.fetchData(`search/movie/${keyword}?per_page=${this.perSearchPage}&page=${page}`);
                console.log(data);
                this.searchResults = data.items;
                this.totalSearchPages = data.totalPages; // Cập nhật tổng số trang từ API
                console.log(this.totalSearchPages);
            } catch (error) {
                console.error('Error fetching search results:', error);
                this.searchResults = [];
            }
        },
    
        changeSearchPage(page) {
            if (page >= 1 && page <= this.totalSearchPages) {
                this.currentSearchPage = page;
                this.fetchSearchResults(this.searchText, page);
            }
        },
    
    },

    created() {
        this.isLoading = true;
        this.fetchRevenueMovies(this.currentRevenueMoviePage);
        this.fetchPopularMovies(this.currentPopularMoviePage);
        this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
        setTimeout(() => {
            this.isLoading = false;
        }, 1000); 
    },
});

app.component('movieslider', MovieSlider);
app.mount('#app');
