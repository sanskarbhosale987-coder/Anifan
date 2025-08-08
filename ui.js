// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
});

// Placeholder for future mirror links functionality
function addMirrorLink(animeId, mirrorUrl) {
    // This function will be implemented in anime detail pages
    console.log(`Mirror link added for anime ${animeId}: ${mirrorUrl}`);
    // In a real implementation, this would store the mirror link
    // and display it on the anime detail page
}

// Example usage (would be called from anime detail pages):
// addMirrorLink('aot-season-4', 'https://example.com/mirror1');

