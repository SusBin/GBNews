document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    const latestBtn = document.getElementById('latest-link');
    const techBtn = document.getElementById('tech-link');
    const scienceBtn = document.getElementById('science-link');
    const worldBtn = document.getElementById('world-link');
    const healthBtn = document.getElementById('health-link');

    
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
    const menuToggle = document.querySelector('.menu-toggle');
    const categoryNav = document.querySelector('.category-nav');

    // Attach click event listener to menu toggle button
    menuToggle.addEventListener('click', function() {
        categoryNav.classList.toggle('show');
        menuToggle.classList.toggle('active');
    });

    const links = document.querySelectorAll('.category-nav a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const clickedCategory = event.target.id.replace("-link", "");
            category = clickedCategory === "latest" ? null : clickedCategory;
            fetchNews(category, null);
            setActiveLink(event.target);
            categoryNav.classList.remove('show');
            menuToggle.classList.remove('active');
        });
    });

    function setActiveLink(activeLink) {
        const links = document.querySelectorAll('.category-nav a');
        links.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
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

    // Format date and time
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }



});
