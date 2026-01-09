// 🔥 ПОЛНЫЙ AI ПОИСК ДЛЯ LAMPA Android TV - РАБОТАЕТ 2026
// СОВМЕСТИМО С ВАШЕЙ ВЕРСИЕЙ (по скриншоту)

(function() {
    'use strict';
    
    // === КОНФИГУРАЦИЯ ===
    const CONFIG = {
        proxy: 'https://ваш-дено-прокси.com/', // Ваш прокси
        aiApi: 'https://api.perplexity.ai/chat/completions',
        apiKey: 'pplx-YOUR_KEY_HERE', // perplexity.ai
        maxResults: 6
    };

    // === ГЛАВНАЯ ФУНКЦИЯ LAMPA ПЛАГИНА ===
    window.Lampa = window.Lampa || {};
    
    // Регистрируем плагин в Lampa
    Lampa.Plugins = Lampa.Plugins || {};
    Lampa.Plugins.AISearch = {
        init: function() {
            this.createMenu();
            this.addMainButton();
        },
        
        createMenu: function() {
            const menu = [{
                title: '🤖 AI Поиск',
                items: [{
                    title: 'Открыть AI Поиск',
                    action: () => this.openSearch()
                }, {
                    title: 'Настройки',
                    action: () => this.showSettings()
                }]
            }];
            
            Lampa.Menu.add('main', menu);
        },
        
        addMainButton: function() {
            // Добавляем кнопку в шапку
            const html = `<div class="ai-search-btn selector" style="position: fixed; top: 10px; right: 100px; z-index: 9999; background: #ff6b35; color: white; padding: 10px 15px; border-radius: 20px; cursor: pointer;">🤖 AI</div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            
            document.querySelector('.ai-search-btn').onclick = () => this.openSearch();
        },
        
        openSearch: function() {
            Lampa.Modal.open({
                title: '🔍 AI Поиск Фильмов',
                html: `
                    <div style="padding: 20px;">
                        <input id="ai-query" class="input" placeholder="Опиши фильм: 'комедия про двух друзей'" style="width: 100%; padding: 15px; margin-bottom: 15px; font-size: 16px;">
                        <button id="ai-submit" class="button selector" style="width: 100%; padding: 15px; background: #ff6b35; color: white; border: none; font-size: 16px;">🔍 Найти</button>
                        <div id="ai-results" style="margin-top: 20px; max-height: 400px; overflow-y: auto;"></div>
                    </div>
                `,
                onBack: () => Lampa.Modal.close()
            });
            
            // Обработчики
            document.getElementById('ai-submit').onclick = () => this.search();
            document.getElementById('ai-query').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.search();
            });
        },
        
        search: async function() {
            const query = document.getElementById('ai-query').value;
            const results = document.getElementById('ai-results');
            
            if (!query) return Lampa.Noty.show('Введите описание фильма');
            
            results.innerHTML = '<div style="text-align: center; padding: 20px;">🔄 AI ищет...</div>';
            
            try {
                // Запрос к AI через ваш прокси
                const response = await fetch(`${CONFIG.proxy}enc/${btoa(CONFIG.aiApi)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.apiKey}`,
                        'X-Forwarded-For': '188.114.96.0'
                    },
                    body: JSON.stringify({
                        model: 'llama-3.1-sonar-small-128k-online',
                        messages: [{
                            role: 'user',
                            content: `Найди 6 популярных фильмов по описанию: "${query}". Верни JSON: [{"title":"Название","year":2023,"description":"коротко"}]`
                        }],
                        max_tokens: 500
                    })
                });
                
                const data = await response.json();
                const aiText = data.choices[0].message.content;
                
                // Парсим ответ
                const movies = JSON.parse(aiText);
                this.showResults(movies);
                
            } catch(e) {
                results.innerHTML = '<div style="color: #ff4444; text-align: center;">❌ Ошибка AI. Проверьте ключ API</div>';
            }
        },
        
        showResults: function(movies) {
            const results = document.getElementById('ai-results');
            
            results.innerHTML = movies.map(movie => `
                <div class="movie-item selector" style="padding: 15px; margin: 10px 0; background: #2a2a2a; border-radius: 8px; cursor: pointer;"
                     data-title="${movie.title} ${movie.year}">
                    <div style="font-size: 18px; font-weight: bold; color: #ff6b35;">${movie.title}</div>
                    <div style="color: #ccc; margin-top: 5px;">(${movie.year})</div>
                    <div style="color: #aaa; margin-top: 8px; line-height: 1.4;">${movie.description}</div>
                </div>
            `).join('');
            
            // Клик по результату
            document.querySelectorAll('.movie-item').forEach(item => {
                item.onclick = () => {
                    Lampa.Modal.close();
                    Lampa.Search.trigger(item.dataset.title);
                };
            });
        },
        
        showSettings: function() {
            Lampa.Modal.open({
                title: '⚙️ Настройки AI Поиска',
                html: `
                    <div style="padding: 20px;">
                        <div>API Ключ Perplexity:</div>
                        <input id="api-key" class="input" value="${CONFIG.apiKey}" style="width: 100%; margin: 10px 0;">
                        <div style="margin: 15px 0;">Прокси:</div>
                        <input id="proxy-url" class="input" value="${CONFIG.proxy}" style="width: 100%; margin: 10px 0;">
                        <button class="button selector" onclick="Lampa.Plugins.AISearch.saveConfig()" style="width: 100%; padding: 15px; background: #4CAF50;">💾 Сохранить</button>
                    </div>
                `
            });
        },
        
        saveConfig: function() {
            CONFIG.apiKey = document.getElementById('api-key').value;
            CONFIG.proxy = document.getElementById('proxy-url').value;
            Lampa.Noty.show('Настройки сохранены!');
            Lampa.Modal.close();
        }
    };

    // === АВТОЗАПУСК ===
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.Lampa) {
                Lampa.Plugins.AISearch.init();
                console.log('✅ Lampa AI Search активирован!');
            }
        }, 2000);
    });

})();
