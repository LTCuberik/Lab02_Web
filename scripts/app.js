import { dbProvider } from './DBprovider.js';
const app = Vue.createApp({
    data() {
        return {
            isDarkMode: localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme'), // Default to dark mode
            getData: [], // Danh sách phim
            currentPage: 0, // Slide hiện tại
            perPage: 1, // Số lượng phim trên mỗi slide
            hoveredMovie: null, // Phim đang được hover
        };
    },
    computed: {
        visibleMovies() {
            const start = this.currentPage * this.perPage;
            return this.getData.slice(start, start + this.perPage);
        },
        totalSlides() {
            return Math.ceil(this.getData.length / this.perPage);
        },
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
        prevSlide() {
            if (this.currentPage > 0) {
                this.currentPage--;
            }
        },
        nextSlide() {
            if (this.currentPage < this.totalSlides - 1) {
                this.currentPage++;
            }
        },
    },
    
    async mounted() {
        this.applyTheme();
        try {

            const data = await dbProvider.analysicData('get/movie/?per_page=5&page=1');
            console.log('get Results:', data);
            this.getData = data.items.map(movie => ({
                title: movie.title,
                releaseYear: movie.year,
                revenue: movie.boxOffice.cumulativeWorldwideGross,
                director: movie.directorList, 
                imdb: movie.ratings.imDb,
                image: movie.image
            }));
            const getData = await dbProvider.analysicData('get/movie/?per_page=5&page=1');
            console.log('Get Results:', getData.items);
        } catch (error) {
            this.errorMessage = 'Error fetching movies: ' + error.message;
        }
    },
});

app.mount('#app');