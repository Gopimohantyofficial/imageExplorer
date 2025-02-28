const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const noResults = document.getElementById('no-results');
const errorMessage = document.getElementById('error-message');

let page = 1;
let currentQuery = '';
let isLoading = false;

async function fetchImages() {
    try {
        isLoading = true;
        loader.style.display = 'block';
        errorMessage.style.display = 'none';
        searchButton.disabled = true;

        const url = `https://pixabay.com/api/?key=49071411-2f7c4849aebac14bd5d9f7b53&q=${encodeURIComponent(currentQuery)}&image_type=photo&page=${page}&per_page=12`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response error');
        
        const data = await response.json();
        
        if (page === 1) imageContainer.innerHTML = '';
        if (data.hits.length === 0 && page === 1) {
            noResults.style.display = 'block';
        } else {
            displayImages(data.hits);
        }
        
        page++;
    } catch (error) {
        showError('Failed to load images. Please try again later.');
    } finally {
        isLoading = false;
        loader.style.display = 'none';
        searchButton.disabled = false;
    }
}

function displayImages(images) {
    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'image-card';
        
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = image.webformatURL;
        img.alt = image.tags || 'Pixabay image';
        
        img.onload = () => img.classList.add('loaded');
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = `
            <i class="fa-solid fa-circle-down"></i>
            <span class="sr-only">Download</span>
        `;
        
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = image.largeImageURL;
            link.download = `image-${image.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        card.append(img, downloadBtn);
        imageContainer.appendChild(card);
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function handleSearch(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showError('Please enter a search term');
        return;
    }
    
    currentQuery = searchTerm;
    page = 1;
    fetchImages();
}

function checkScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
        fetchImages();
    }
}

document.getElementById('search-form').addEventListener('submit', handleSearch);
window.addEventListener('scroll', checkScroll);
fetchImages();