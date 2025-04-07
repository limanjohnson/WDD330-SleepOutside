import { updateCartCount } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// display cart count
updateCartCount();

// load header and footer
loadHeaderFooter();


document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('registrationBanner');
    const closeButton = document.getElementById('closeBanner');
    const bannerShown = localStorage.getItem('bannerShown');
  
    // Check if the banner has already been shown
    if (!bannerShown) {
      // If not shown, display the banner
      banner.style.display = 'block';
  
      // When the user clicks the close button, hide the banner and remember
      closeButton.addEventListener('click', function() {
        banner.style.display = 'none';
        localStorage.setItem('bannerShown', 'true'); // Remember we showed it
      });
    }
  });