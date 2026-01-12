(function() {
    'use strict';
    
    async function tmdbSearch(query) {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=ru-RU&query=${encodeURIComponent(query)}&page=1&include_adult=false`
            );
            const data = await response.json();
            return data.results || [];
        } catch(e) {
            return [];
        }
    }
    
    function createAIButton() {
        if (document.querySelector('.ai-search-menu')) return;
        
        const selectors = [
            '.menu-items', 
            '.menu', 
            '.full-start__menu', 
            '.menu-row',
            '[class*="menu"]',
            '.categories'
        ];
        
        let menu = null;
        for (let sel of selectors) {
            menu = document.querySelector(sel);
            if (menu) break;
        }
        
        if (!menu) return;
        
        const aiItem = document.createElement('div');
        aiItem.className = 'ai-search-menu selector';
        aiItem.innerHTML = `
            <div style="display:flex;align-items:center;padding:15px 20px;border-bottom:1px solid #333;">
                <div style="font-size:28px;margin-right:15px;">🔍</div>
                <div>
                    <div style="font-size:16px;font-weight:bold;color:white;">AI Поиск</div>
                    <div style="font-size:12px;color:#aaa;">Поиск по описанию</div>
                </div>
            </div>
        `;
        
        aiItem.onclick = async function() {
            const query = prompt('🎬 Введите описание:\n"море пираты", "любовь драма", "детектив"');
            if (!query) return;
            
            Lampa.Noty.show('🔎 Ищем...');
            const results = await tmdbSearch(query);
            
            if (results.length) {
                Lampa.Noty.show(results.length + ' фильмов найдено!');
                // ПРАВИЛЬНЫЙ переход к поиску БЕЗ синтаксических ошибок
                if (window.Controller && Controller.toContent) {
                    Controller.toContent({
                        url: 'search',
                        search: query,
                        search_one: query,
                        title: 'AI Поиск: ' + query
                    });
                } else {
                    // Запасной вариант
                    window.location.hash = '#!/search/' + encodeURIComponent(query);
                }
            } else {
                Lampa.Noty.show('Ничего не найдено');
            }
        };
        
        menu.appendChild(aiItem);
        if (Lampa && Lampa.Noty) {
            Lampa.Noty.show('✅ AI Поиск добавлен!');
        }
    }
    
    // Запуск с задержками для надежности
    setTimeout(createAIButton, 2000);
    setTimeout(createAIButton, 5000);
    setTimeout(createAIButton, 10000);
    
    let attempts = 0;
    const interval = setInterval(() => {
        createAIButton();
        attempts++;
        if (attempts > 20) clearInterval(interval);
    }, 2000);
})();
