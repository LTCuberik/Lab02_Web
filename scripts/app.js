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
        };
    },
    computed: {
    },
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
            if (this.currentRevenueMoviePage > 0) {
                this.currentRevenueMoviePage--;
                await this.fetchRevenueMovies(this.currentRevenueMoviePage + 1);
            }
        },
        async nextRevMoviesSlide() {
            if (this.currentRevenueMoviePage < this.totalSlides - 1) {
                this.currentRevenueMoviePage++;
                await this.fetchRevenueMovies(this.currentRevenueMoviePage + 1);
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
            if (this.currentPopularMoviePage > 0) {
                this.currentPopularMoviePage--;
                await this.fetchPopularMovies(this.currentPopularMoviePage + 1);
            }
        },

        // Next Slide for Most Popular
        async nextPopularMoviesSlide() {
            if (this.currentPopularMoviePage < this.totalSlides - 1) {
                this.currentPopularMoviePage++;
                await this.fetchPopularMovies(this.currentPopularMoviePage + 1);
            }
        },
    },
    
    async mounted() {
        this.applyTheme();
        await this.fetchRevenueMovies(this.currentRevenueMoviePage);
        await this.fetchPopularMovies(this.currentPopularMoviePage);
    },
});

app.mount('#app');