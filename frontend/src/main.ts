function handleSmoothScroll(): void {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e: MouseEvent) {
            e.preventDefault();

            const href = this.getAttribute('href');
            if (href) {
                const targetElement = document.querySelector<HTMLElement>(href);
                targetElement?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code

    const currentPage = window.location.pathname.split('/').pop() || '';
    if (currentPage === 'index.html' || currentPage === '') {
        handleSmoothScroll();
    }

    // ... rest of your code
});
