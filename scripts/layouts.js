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
}