document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    const latestBtn = document.getElementById('latest-btn');
    const techBtn = document.getElementById('tech-btn');
    const scienceBtn = document.getElementById('science-btn');
    const worldBtn = document.getElementById('world-btn');
    const healthBtn = document.getElementById('health-btn');

    
    const apiKey = 'pub_45181541590cf247c24fdaa5a26ca879fd502';
    let category = null; 

    // Function to fetch news based on category and search keyword
    function fetchNews(categoryParam, searchParam) {
        let apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=gb&language=en`;

        // Append category parameter if provided
        if (categoryParam) {
            apiUrl += `&category=${categoryParam}`;
        }

        // Append search parameter if provided
        if (searchParam) {
            apiUrl += `&q=${encodeURIComponent(searchParam)}`;
        }
        
        axios.get(apiUrl)
            .then(response => {
                const articles = response.data.results;                
                newsContainer.innerHTML = '';                
                displayNews(articles);
            })
            .catch(error => {
                console.error('Error fetching the news data:', error);
                newsContainer.innerHTML = '<p>Failed to load news data. Please try again later.</p>';
            });
    }

    // Event listeners for category buttons
    latestBtn.addEventListener('click', function() {
        category = null; // Reset category
        fetchNews(category, null);
        setActiveButton(latestBtn);
    });

    techBtn.addEventListener('click', function() {
        category = 'technology';
        fetchNews(category, null);
        setActiveButton(techBtn);
    });

    scienceBtn.addEventListener('click', function() {
        category = 'science';
        fetchNews(category, null);
        setActiveButton(scienceBtn);
    });

    worldBtn.addEventListener('click', function() {
        category = 'world';
        fetchNews(category, null);
        setActiveButton(worldBtn);
    });

    healthBtn.addEventListener('click', function() {
        category = 'health';
        fetchNews(category, null);
        setActiveButton(healthBtn);
    });

    function setActiveButton(activeBtn) {
        const buttons = document.querySelectorAll('.category-btns button');
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            fetchNews(null,searchTerm);
            console.log('Searching for:', searchTerm);
        } else {
            alert('Please enter a search term.');
        }
    });
    
    fetchNews(null);

    // Display news on the page
    function displayNews(articles) {
        if (articles.length === 0) {
            newsContainer.innerHTML = '<p>No news articles available.</p>';
            return;
        }
        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const sourceIcon = document.createElement('div');
            sourceIcon.classList.add('source-icon');
            sourceIcon.style.backgroundImage = `url(${article.source_icon || 'default-icon.png'})`;

            const newsContent = document.createElement('div');
            newsContent.classList.add('news-content');

            const title = document.createElement('h3');
            title.textContent = article.title || 'No Title';

            const description = document.createElement('p');
            description.innerHTML = article.description || 'No Description Available';

            const link = document.createElement('a');
            link.href = article.link || '#';
            link.textContent = 'Read more';
            link.target = '_blank';

            const date = document.createElement('div');
            date.classList.add('muted');
            date.textContent = formatDate(article.pubDate || new Date());

            newsContent.appendChild(title);
            newsContent.appendChild(description);
            newsContent.appendChild(link);
            newsContent.appendChild(date);
            newsItem.appendChild(sourceIcon);
            newsItem.appendChild(newsContent);
            newsContainer.appendChild(newsItem);
        });
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    }
});
