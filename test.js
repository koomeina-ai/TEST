(function() {
    'use strict';
    
    function addAIButton() {
        // Добавляем на главный экран как плитку
        if (window.Lampa && !document.querySelector('.ai-tile')) {
            const tile = document.createElement('div');
            tile.className = 'ai-tile selector full-start__button-item';
            tile.innerHTML = `
                <div class="full-start__button-icon" style="background: linear-gradient(45deg, #4285f4, #34a853); width: 60px; height: 60px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto;">🔍</div>
                <div class="full-start__button-text" style="font-size: 12px; text-align: center; color: white;">AI Поиск</div>
            `;
            tile.onclick = async () => {
                const query = prompt('🎬 Фильмы про что найти?\n(море, пираты, любовь, детектив...)');
                if (!query) return;
                
                Lampa.Noty.show('🔎 Ищем...');
                try {
                    const resp = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=ru-RU&query=${encodeURIComponent(query)}&page=1`);
                    const data = await resp.json();
                    const results = data.results || [];
                    
                    if (results.length) {
                        Lampa.Noty.show(`${results.length} фильмов найдено!`);
                        Controller.toContent({
                            url: 'search',
                            title: `AI Поиск: ${query}`,
                            search: query,
                            search_one: query,
                            component: 'full',
                            page: 1
                        });
                    } else {
                        Lampa.Noty.show('Ничего не найдено :(');
                    }
                } catch(e) {
                    Lampa.Noty.show('Ошибка интернета');
                }
            };
            
            // Вставляем в меню плиток (главный экран)
            const menu = document.querySelector('.full-start__buttons');
            if (menu) {
                menu.appendChild(tile);
                Lampa.Noty.show('✅ AI Поиск добавлен на главный экран!');
            }
        }
    }
    
    // Ждем загрузку главной страницы
    setTimeout(addAIButton, 3000);
    setInterval(addAIButton, 5000); // Пытаемся 10 секунд
})();
