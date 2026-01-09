// 🔥 AI Movie Search для LAMPA - поиск фильмов по описанию через нейросеть
// @name         Lampa AI Поиск Фильмов
// @match        *://*/*lampa*/*
// @match        *://*/*card/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @version      1.0

(function () {
    'use strict';

    // Конфигурация AI API (замените на свой ключ)
    const AI_CONFIG = {
        apiUrl: 'https://api.perplexity.ai/chat/completions', // Perplexity AI
        apiKey: 'YOUR_API_KEY_HERE', // Получите на perplexity.ai
        proxy: 'https://ваш-дено-прокси.com/', // Ваш Deno прокси
        maxResults: 5
    };

    // Добавляем кнопку AI поиска в интерфейс LAMPA
    function addAISearchButton() {
        if (document.querySelector('#ai-search-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'ai-search-panel';
        panel.innerHTML = `
            <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input id="ai-search-input" placeholder="Опишите фильм AI найдет: 'драма про слепого миллионера'" 
                           style="flex: 1; padding: 10px; border: 1px solid #444; border-radius: 4px; background: #2a2a2a; color: white;">
                    <button id="ai-search-btn" style="padding: 10px 20px; background: #ff6b35; border: none; border-radius: 4px; color: white; cursor: pointer;">
                        🔍 AI Поиск
                    </button>
                </div>
                <div id="ai-results" style="margin-top: 10px; max-height: 300px; overflow-y: auto;"></div>
            </div>
        `;
        
        // Вставляем после поисковой строки LAMPA
        const searchContainer = document.querySelector('.searchbox, .input-search, [class*="search"]');
        if (searchContainer) {
            searchContainer.parentNode.insertBefore(panel, searchContainer.nextSibling);
        }
        
        // Обработчик поиска
        document.getElementById('ai-search-btn').onclick = performAISearch;
        document.getElementById('ai-search-input').onkeypress = (e) => {
            if (e.key === 'Enter') performAISearch();
        };
    }

    // AI поиск через Perplexity
    async function performAISearch() {
        const input = document.getElementById('ai-search-input');
        const results = document.getElementById('ai-results');
        const query = input.value.trim();
        
        if (!query) return;
        
        results.innerHTML = '<div style="color: #888;">🔄 AI ищет фильмы...</div>';
        
        try {
            // Запрос к AI с промптом для поиска фильмов
            const response = await fetch(AI_CONFIG.proxy + 'enc/' + btoa(AI_CONFIG.apiUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-sonar-small-128k-online',
                    messages: [{
                        role: 'user',
                        content: `Найди ${AI_CONFIG.maxResults} фильмов по описанию: "${query}". 
                        Верни JSON массив с названием, годом, жанром и кратким описанием. 
                        Формат: [{"title":"Название","year":2023,"genre":"драма","description":"..."}]`
                    }]
                })
            });
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Парсим JSON из ответа AI
            const movies = JSON.parse(aiResponse);
            displayResults(movies);
            
        } catch (error) {
            results.innerHTML = '<div style="color: #ff4444;">❌ Ошибка AI поиска</div>';
            console.error('AI Search error:', error);
        }
    }

    // Отображение результатов
    function displayResults(movies) {
        const results = document.getElementById('ai-results');
        if (!movies || movies.length === 0) {
            results.innerHTML = '<div style="color: #ffaa00;">🤔 Фильмы не найдены</div>';
            return;
        }
        
        results.innerHTML = movies.map((movie, i) => `
            <div style="border: 1px solid #444; border-radius: 6px; padding: 12px; margin: 8px 0; background: #252525; cursor: pointer;"
                 onclick="window.Lampa.Search.trigger('${movie.title} ${movie.year}');">
                <div style="font-weight: bold; color: #ff6b35;">${movie.title} (${movie.year})</div>
                <div style="color: #ccc; font-size: 14px;">${movie.genre}</div>
                <div style="color: #aaa; font-size: 13px; line-height: 1.4;">${movie.description}</div>
            </div>
        `).join('');
    }

    // Инициализация при загрузке LAMPA
    function init() {
        const checkLampa = setInterval(() => {
            if (window.Lampa || document.querySelector('.searchbox, .input-search')) {
                clearInterval(checkLampa);
                setTimeout(addAISearchButton, 1000);
            }
        }, 500);
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('🎬 Lampa AI Movie Search активирован!');
})();
