import { createApp } from 'vue';  // Import Vue
import { comNav, comRevenueMovie } from './layouts.js';  // Import component comNav
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
            selectedActor: null,
            //
            searchText: '', // Từ khóa tìm kiếm
            searchResults: [], // Kết quả tìm kiếm
            currentSearchPage: 1, // Trang hiện tại của tìm kiếm
            perSearchPage: 9, // Số lượng phim mỗi trang
            totalSearchPages: 0, // Tổng số trang tìm kiếm
            isSearchPage: false, // Xác định trạng thái đang ở trang tìm kiếm
            //
            currentMovieActorPage: 1, // Trang hiện tại của tìm kiếm
            perMovieActorPage: 9, // Số lượng phim mỗi trang
            totalMovieActorPages: 0, // Tổng số trang tìm kiếm
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

        async showMovieDetails(id) {
            const data = await dbProvider.fetchData(`detail/movie/${id}`);
            console.log(data);
            this.selectedMovie = data;
        },

        async showActorDetails(actorId) {
            const data = await dbProvider.fetchData(`detail/movie/${id}`);
            
        },

        backToHome() {
            this.selectedMovie = null;
            this.isSearchPage = false; 
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

        async prevTopRatedMoviesSlide() {
            if (this.currentTopRatedMoviePage > 1) {
                this.currentTopRatedMoviePage--;
                await this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
            }
        },

        async nextTopRatedMoviesSlide() {
            if (this.currentTopRatedMoviePage < this.totalSlides) {
                this.currentTopRatedMoviePage++;
                await this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
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

    components: {
        comRevenueMovie 
    },

    created() {
        this.fetchRevenueMovies(this.currentRevenueMoviePage);
        this.fetchPopularMovies(this.currentPopularMoviePage);
        this.fetchTopRatedMovies(this.currentTopRatedMoviePage);
    },
});

app.mount('#app');
