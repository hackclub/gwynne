document.addEventListener("DOMContentLoaded", function() {
    const scrollers = document.querySelectorAll(".scroller");
    
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation(scrollers);
    }
    
    // COUNTERS FOR THE STATS * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    const counters = document.querySelectorAll(".counter");
    const options = {
        root: null, // use the viewport as the root
        threshold: 0.5, // trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const final_count = parseInt(counter.dataset.count);
                let initial_count = 0;
                let counting = true; // flag to track counting status

                // calculate the acceleration factor based on the final count
                let accelerationFactor;
                if (final_count >= 1000) {
                    accelerationFactor = 15; // faster acceleration
                } else if (final_count <= 100) {
                    accelerationFactor = 1; // slower acceleration
                } else {
                    accelerationFactor = 3; // medium acceleration
                }

                function updateCounting() {
                    if (initial_count < final_count) {
                        initial_count += accelerationFactor;
                        counter.innerText = initial_count;

                        // schedule the next update
                        requestAnimationFrame(updateCounting);
                    } else if (initial_count >= 1000) {
                        initial_count++;
                        counter.innerText = (initial_count / 1000).toFixed(1) + 'K+';
                    }

                    if (initial_count >= final_count && counting) {
                        counting = false; // stop counting
                        observer.unobserve(counter); // stop observing once visible
                    }
                }

                updateCounting(); // start counting
            }
        });
    }, options);

    counters.forEach((counter) => {
        observer.observe(counter);
    });


});

function addAnimation(scrollers) {
    scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector('.scroller__inner')
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        })
    });
}