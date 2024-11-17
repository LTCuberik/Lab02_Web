import { dbProvider } from './DBprovider.js';
const app = Vue.createApp({
    data() {
        return {
            isDarkMode: localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme'), // Default to dark mode
            currentRevenueMoviePage: 1, // Slide hiện tại
            perRevenueMoviePage: 1, // Số lượng phim trên mỗi slide
            hoveredMovie: null, // Phim đang được hover
            revenueMovies: [],
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
    },
    
    async mounted() {
        this.applyTheme();
        await this.fetchRevenueMovies(this.currentRevenueMoviePage + 1);
    },
});

app.mount('#app');