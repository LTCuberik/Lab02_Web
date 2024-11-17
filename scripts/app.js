const app = Vue.createApp({
    data() {
        return {
            isDarkMode: localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme'), // Default to dark mode
            movies: [],
            errorMessage: ''
        };
    },
    mounted() {
        try {
            this.applyTheme();
            const detailData = await dbprovider.analysicData('detail/movie/tt0012349');
            console.log('Detail Results:', detailData);

            const searchData = await dbProvider.analysicData('search/movie/the?per_page=5&page=1');
            console.log('Search Results:', searchData.items);

            const getData = await dbProvider.analysicData('get/movie/?per_page=5&page=1');
            console.log('Get Results:', getData.items);
        } catch (error) {
            this.errorMessage = 'Error fetching movies: ' + error.message;
        }
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

            // Update Bootstrap theme attribute
            htmlElement.setAttribute('data-bs-theme', theme);

            // Apply custom CSS classes
            document.body.classList.toggle('dark-mode', this.isDarkMode);
            document.body.classList.toggle('light-mode', !this.isDarkMode);
        }
    }
});

app.mount('#movieApp');