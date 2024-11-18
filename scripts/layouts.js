export const comNav ={
    template: `
    <nav class="d-flex justify-content-between rounded nav">
      <span class="d-flex align-items-center"><i class="fa-solid fa-house"></i></span>
      <div class="inputGroup">
        <input type="text" class="rounded formControl" id="inputSearch" placeholder="Search..."/>
        <span class="inputGroupSearchIcon" id="searchIcon">Search</span>
      </div>
    </nav>`
};

export const comHeader ={
    template: `
    <div class="d-flex align-items-center rounded header">
      <h4>20120319</h4>
      <h2>Movies Info</h2>
      <div class="form-check form-switch d-flex justify-content-center">
        <input 
          class="form-check-input" 
          type="checkbox" 
          id="darkModeSwitch" 
          v-model="isDarkMode" 
          @change="toggleTheme">
        <label 
          class="form-check-label" 
          for="darkModeSwitch" 
          v-html="isDarkMode ? '<i class=\'fa-solid fa-moon\'></i>' : '<i class=\'fa-regular fa-sun\'></i>'">
        </div>
    </div>
    `
};

export const comRevenueMovie = {
    template:` 
      <!-- Movies Info -->
      <div class="movies-section">
        <div class="position-relative">
          <!-- Movie Slider Container -->
          <div id="movieSlider" class="row">
            <div 
              class="col-4 slider-item text-center" 
              v-for="(movie, index) in revenueMovies" 
              :key="index"
              @mouseover="hoveredMovie = index"
              @mouseleave="hoveredMovie = null"
              @click="showMovieDetails(movie.id)">
              <div class="card h-100 justify-content-center">
                <img :src="movie.image || 'https://via.placeholder.com/150'" alt="Movie Poster" class="card-img-top  rounded">
                <div class="card-movie-body position-absolute bottom-0 start-0 w-100 text-black p-2">
                  <h5 class="card-title">
                    {{ movie.fullTitle }}<br>
                  </h5>
                  <h6 class="card-title">
                    ImDb: {{ movie.ratings.imDb }} - Revenue: {{ movie.revenue }}
                  </h6>
                  <h6 class="card-title bonus">
                    Directors: {{ this.convertListToString(movie.directorList, "name") }} <br> Genre: {{ this.convertListToString(movie.genreList, "value") }}
                  </h6>
                </div>
                      
                <!-- Progress Bar -->                    
                <div class="d-flex position-absolute bottom-0 start-0 w-100 justify-content-center align-items-center gap-2 my-3">               
                  <span                       
                    v-for="index in totalSlides"                       
                    :key="index"                       
                    class="progress-bar-item"                      
                    :class="{ active: index === currentRevenueMoviePage }">                    
                  </span>
                </div>                  
              </div>              
            </div>          
          </div>  
          
        <!-- Navigation Buttons -->          
        <button class="btn position-absolute top-50 start-0 mx-5 translate-middle-y" @click="prevRevMoviesSlide">            
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="btn position-absolute top-50 end-0 mx-5 translate-middle-y" @click="nextRevMoviesSlide">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    `
}