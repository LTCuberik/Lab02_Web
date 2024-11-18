import { createApp } from 'vue';  // Import Vue
import { comNav } from './layouts.js';  // Import component comNav
import { dbProvider } from './DBprovider.js';

const app = Vue.createApp({
    data() {
        return {
            isDarkMode: localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme'), // Default to dark mode
            currentRevenueMoviePage: 1, // Slide hiện tại
            perRevenueMoviePage: 1, // Số lượng phim trên mỗi slide
            hoveredMovie: null, // Phim đang được hover
            revenueMovies: [],
            //
            currentPopularMoviePage: 1, // Slide hiện tại cho Most Popular
            perPopularMoviePage: 3, // Số lượng phim trên mỗi slide cho Most Popular
            hoveredPopularMovie: null, // Phim đang được hover cho Most Popular
            popularMovies: [], // Dữ liệu phim Most Popular
            //
            currentTopRatedMoviePage: 1, // Slide hiện tại cho Top Rated
            perTopRatedMoviePage: 3, // Số lượng phim trên mỗi slide cho Top Rated
            hoveredTopRatedMovie: null, // Phim đang được hover cho Top Rated
            topRatedMovies: [], // Dữ liệu phim Top Rated
            //
            selectedMovie: null, // Movie đang được chọn
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

        calculateRevenue(boxOffice) {
            const parseAmount = (amount) => parseInt(amount.replace(/[\$,]/g, "")) || 0; // Loại bỏ ký tự $ và , để chuyển thành số
            const gross = parseAmount(boxOffice.cumulativeWorldwideGross);
            if (!gross) return 0;
            return gross;
        },

        showMovieDetails(movie) {
            this.selectedMovie = movie;
        },
        
        backToHome() {
            this.selectedMovie = null;
        },

        async fetchRevenueMovies(page) {
            try {
                const data = await dbProvider.fetchData(`get/movie/?per_page=${this.perRevenueMoviePage}&page=${page}`);
                
                this.revenueMovies = data.items.map(movie => ({
                    title: movie.title,
                    releaseYear: movie.year,
                    revenue: movie.boxOffice.cumulativeWorldwideGross,
                    imdb: movie.ratings.imDb,
                    image: movie.image,
                    producer: movie.producer || 'Unknown',  // Assuming the field exists in the API
                    director: movie.director || 'Unknown',  // Assuming the field exists in the API
                    actors: movie.actors || 'Unknown',      // Assuming the field exists in the API
                }));
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
                this.popularMovies = data.items.map(movie => ({
                    title: movie.title,
                    releaseYear: movie.year,
                    image: movie.image,
                    genre: movie.genre || 'Unknown',  
                    director: movie.director || 'Unknown',  // Assuming the field exists in the API
                }));
            } catch (error) {
                console.error('Error fetching popular movies:', error);
            }
        },

        // Previous Slide for Most Popular
        async prevPopularMoviesSlide() {
            if (this.currentPopularMoviePage > 1) {
                this.currentPopularMoviePage--;
                await this.fetchPopularMovies(this.currentPopularMoviePage);
            }
        },

        // Next Slide for Most Popular
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
                this.topRatedMovies = data.items.map(movie => ({
                    title: movie.title,
                    releaseYear: movie.year,
                    image: movie.image,
                    genre: movie.genre || 'Unknown',
                    director: movie.director || 'Unknown',
                }));
            } catch (error) {
                console.error('Error fetching top rated movies:', error);
            }
        },

        // Previous Slide for Top Rated
        async prevTopRatedMoviesSlide() {
            if (this.currentTopRatedMoviePage > 0) {
                this.currentTopRatedMoviePage--;
                await this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
            }
        },

        // Next Slide for Top Rated
        async nextTopRatedMoviesSlide() {
            if (this.currentTopRatedMoviePage < this.totalSlides) {
                this.currentTopRatedMoviePage++;
                await this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
            }
        },
    },
    components:{
        comNav
    },


    async mounted() {
        this.applyTheme();
        await this.fetchRevenueMovies(this.currentRevenueMoviePage);
        await this.fetchPopularMovies(this.currentPopularMoviePage);
        await this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
    },
});

app.mount('#app');
