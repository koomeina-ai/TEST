(function() {
    'use strict';
    
    const api = {
        async search(query, page = 1) {
            const url = `https://api.themoviedb.org/3/search/multi?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=ru-RU&query=${encodeURIComponent(query)}&page=${page}`;
            try {
                const resp = await fetch(url);
                const json = await resp.json();
                return json.results || [];
            } catch(e) {
                console.error('TMDB error:', e);
                return [];
            }
        }
    };

    // Ждем загрузки Lampa и добавляем кнопку в поиск
    const addButton = () => {
        const searchContainer = document.querySelector('.search__input-wrapper, .searchbox, .view--search .input');
        if (searchContainer && !searchContainer.querySelector('.ai-search-btn')) {
            const btn = document.createElement('div');
            btn.className = 'ai-search-btn selector';
            btn.style.cssText = 'padding:10px; background:#4285f4; color:white; border-radius:5px; cursor:pointer; margin-left:10px; display:inline-block;';
            btn.textContent = '🔍 AI Поиск';
            btn.onclick = async () => {
                const keywords = prompt('Введите описание фильма (море, пираты, любовь):');
                if (!keywords) return;
                
                // Показываем результаты в категории "full"
                const results = await api.search(keywords);
                Lampa.Activity.push({
                    url: '',
                    title: `AI Поиск: ${keywords}`,
                    component: 'full',
                    html: Lampa.Template.get('items_line', {
                        items: results.slice(0, 20).map(item => ({
                            title: item.title || item.name,
                            original_title: item.original_title || item.original_name,
                            img: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
                            description: item.overview?.slice(0, 100),
                            year: item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4),
                            genres: item.genre_ids
                        }))
                    })
                });
            };
            searchContainer.appendChild(btn);
            console.log('AI Search button added');
        }
    };

    // Проверяем каждые 500мс до появления поиска
    const interval = setInterval(() => {
        if (document.querySelector('.view--search, .search')) {
            addButton();
        }
        if (Lampa && Lampa.Activity) clearInterval(interval);
    }, 500);

    // Альтернатива: добавляем в главное меню
    if (window.Lampa) {
        Lampa.Listener.follow('app', (e) => {
            if (e.type == 'ready') setTimeout(addButton, 2000);
        });
    }
})();
