(function() {
    'use strict';
    
    // Функция поиска через TMDB
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
    
    // Создаем кнопку AI поиска
    function createAIButton() {
        if (document.querySelector('.ai-search-menu')) return;
        
        const menu = document.querySelector('.menu-items, .menu, .full-start__menu, [class*="menu"]');
        if (!menu) return;
        
        const aiItem = document.createElement('div');
        aiItem.className = 'ai-search-menu selector menu__item menu-item-selector';
        aiItem.innerHTML = `
            <div class="menu__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </div>
            <div class="menu__title">🔍 AI Поиск</div>
        `;
        
        aiItem.onclick = async function() {
            const query = prompt('🎬 Введите описание фильма:\nпример: "море пираты приключения"');
            if (!query) return;
            
            Lampa.Noty.show('🔎 Ищем фильмы...');
            const results = await tmdbSearch(query);
            
            if (results.length) {
                Lampa.Noty.show(`${results.length} результатов`);
                // Переходим к результатам поиска
                window.location.href = '#/search/' + encodeURIComponent(query);
            } else {
                Lampa.Noty.show('Фильмы не найдены');
            }
        };
        
        menu.appendChild(aiItem);
        Lampa.Noty.show('✅ AI Поиск добавлен в меню!');
    }
    
    // Запускаем через 3 секунды и повторяем каждые 2 секунды
    setTimeout(createAIBut
