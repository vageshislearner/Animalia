"use strict";
document.querySelectorAll('.qna-toggle').forEach(button => {
    button.addEventListener('click', () => {
        let answer = button.nextElementSibling;
        answer.style.display = (answer.style.display === "block") ? "none" : "block";
    });
});
let slideIndex = 0;
function showSlides() {
    let slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.style.display = "none");
    
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 2000); // Change every 2 seconds
}
showSlides();
window.addEventListener("scroll", function () {
    let donationButton = document.getElementById("btn");
    let waterImage = document.getElementById("water");

    let waterPosition = waterImage.getBoundingClientRect().top;
    let buttonPosition = donationButton.getBoundingClientRect().bottom;

    if (buttonPosition >= waterPosition) {
        donationButton.classList.add("hide-donation"); // Hide button
    } else {
        donationButton.classList.remove("hide-donation"); // Show button
    }
});
"use strict";

// Q&A Functionality - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow (keep your existing slideshow code)
    let slideIndex = 0;
    function showSlides() {
        let slides = document.querySelectorAll('.slide');
        slides.forEach(slide => slide.style.display = "none");
        
        slideIndex++;
        if (slideIndex > slides.length) slideIndex = 1;
        
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 2000);
    }
    if (document.querySelectorAll('.slide').length > 0) {
        showSlides();
    }

    // Donation button scroll effect (keep your existing donation button code)
    window.addEventListener("scroll", function() {
        let donationButton = document.getElementById("btn");
        let waterImage = document.getElementById("water");

        if (donationButton && waterImage) {
            let waterPosition = waterImage.getBoundingClientRect().top;
            let buttonPosition = donationButton.getBoundingClientRect().bottom;

            if (buttonPosition >= waterPosition) {
                donationButton.classList.add("hide-donation");
            } else {
                donationButton.classList.remove("hide-donation");
            }
        }
    });

    // ===== IMPROVED Q&A FUNCTIONALITY =====
    const qnaItems = document.querySelectorAll('.qna-item');
    
    // Improved Q&A Toggle
    document.querySelectorAll('.qna-question').forEach(question => {
        question.addEventListener('click', function(e) {
            const item = this.closest('.qna-item');
            const answer = item.querySelector('.qna-answer');
            const wasActive = item.classList.contains('active');
            
            // Close all items first
            qnaItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.qna-answer').style.maxHeight = '0';
            });
            
            // Toggle current item if it wasn't active
            if (!wasActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Improved Helpful Buttons
    document.querySelectorAll('.qna-helpful-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the question click
            
            const buttonsContainer = this.parentElement;
            const item = this.closest('.qna-item');
            
            // Reset all buttons in this Q&A item
            item.querySelectorAll('.qna-helpful-button').forEach(btn => {
                btn.classList.remove('active', 'liked', 'disliked');
            });
            
            // Set active state and specific class
            this.classList.add('active');
            if (this.textContent.trim().includes('Yes')) {
                this.classList.add('liked');
            } else {
                this.classList.add('disliked');
            }
        });
    });

    // Improved Search Functionality
    const qnaSearchInput = document.querySelector('.qna-search input');
    if (qnaSearchInput) {
        qnaSearchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            if (searchTerm === '') {
                qnaItems.forEach(item => {
                    item.style.display = 'block';
                    item.classList.remove('active');
                    item.querySelector('.qna-answer').style.maxHeight = '0';
                });
                return;
            }
            
            qnaItems.forEach(item => {
                const question = item.querySelector('.qna-question').textContent.toLowerCase();
                const answer = item.querySelector('.qna-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }, 300));
    }

    // Debounce function for better performance
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

});

// Testimonials Carousel
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (testimonialsContainer && testimonialCards.length > 0) {
        let currentIndex = 0;
        
        // Update dots navigation
        function updateDots(index) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Auto-scroll testimonials
        function autoScrollTestimonials() {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            testimonialsContainer.scrollTo({
                left: testimonialCards[currentIndex].offsetLeft - 30,
                behavior: 'smooth'
            });
            updateDots(currentIndex);
        }
        
        // Set up dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                testimonialsContainer.scrollTo({
                    left: testimonialCards[index].offsetLeft - 30,
                    behavior: 'smooth'
                });
                updateDots(index);
            });
        });
        
        // Auto-scroll every 5 seconds
        let scrollInterval = setInterval(autoScrollTestimonials, 5000);
        
        // Pause auto-scroll on hover
        testimonialsContainer.addEventListener('mouseenter', () => {
            clearInterval(scrollInterval);
        });
        
        testimonialsContainer.addEventListener('mouseleave', () => {
            scrollInterval = setInterval(autoScrollTestimonials, 5000);
        });
    }
});
