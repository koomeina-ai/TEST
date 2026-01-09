(function() {
    'use strict';

    const CONFIG = {
        proxy: 'xn-----6kchmgwpzkblnq8g.com', 
        aiApi: 'api.perplexity.ai',
        apiKey: 'pplx-ВАШ_КЛЮЧ', 
        model: 'sonar' // Актуальная модель на 2026 год
    };

    window.Lampa = window.Lampa || {};
    
    Lampa.Plugins.AISearch = {
        init: function() {
            this.addMainButton();
            // Ждем готовности меню
            Lampa.Listener.follow('app', (e) => {
                if (e.type === 'ready') this.createMenu();
            });
        },

        createMenu: function() {
            let menu_item = {
                title: 'AI Поиск',
                icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="www.w3.org"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
                section: 'main'
            };
            
            // Интеграция в левое меню Lampa
            Lampa.Menu.add(menu_item, () => {
                this.openSearch();
            });
        },

        addMainButton: function() {
            const btn = $(`<div class="ai-search-btn selector" style="position: fixed; top: 1.5rem; right: 10rem; z-index: 999; background: #ff6b35; color: white; padding: 0.8rem 1.5rem; border-radius: 2rem; cursor: pointer; display: flex; align-items: center;">
                <span style="margin-right: 5px;">🤖</span> AI Поиск
            </div>`);
            
            btn.on('hover:enter click', () => this.openSearch());
            $('body').append(btn);
        },

        openSearch: function() {
            const html = $(`
                <div class="ai-search-modal" style="padding: 1rem;">
                    <div class="ai-search-input-wrap" style="margin-bottom: 1.5rem;">
                        <input type="text" class="ai-input selector" placeholder="Опишите фильм (например: триллер про космос с неожиданным концом)" style="width: 100%; background: rgba(255,255,255,0.1); border: none; padding: 1rem; color: #fff; border-radius: 0.5rem;">
                    </div>
                    <div class="ai-btn-search selector" style="width: 100%; background: #ff6b35; padding: 1rem; text-align: center; border-radius: 0.5rem; font-weight: bold; margin-bottom: 1.5rem;">НАЙТИ</div>
                    <div class="ai-results-container"></div>
                </div>
            `);

            Lampa.Modal.open({
                title: 'Интеллектуальный подбор',
                html: html,
                size: 'medium',
                onBack: () => {
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('content');
                }
            });

            // Активируем контроллер пульта для модалки
            Lampa.Controller.add('ai_modal', {
                toggle: () => {
                    Lampa.Controller.collectionSet(html);
                    Lampa.Controller.navigate();
                },
                back: () => {
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('content');
                }
            });
            Lampa.Controller.toggle('ai_modal');

            html.find('.ai-btn-search').on('hover:enter click', () => this.startSearch(html));
        },

        startSearch: async function(html) {
            const query = html.find('.ai-input').val();
            const container = html.find('.ai-results-container');
            
            if (!query) return Lampa.Noty.show('Введите описание!');

            container.html('<div style="text-align: center; padding: 2rem;">🧠 Нейросеть думает...</div>');

            try {
                const response = await fetch(`${CONFIG.proxy}enc/${btoa(CONFIG.aiApi)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.apiKey}`
                    },
                    body: JSON.stringify({
                        model: CONFIG.model,
                        messages: [{
                            role: 'user', 
                            content: `Найди 6 фильмов по описанию: "${query}". Ответь ТОЛЬКО чистым JSON массивом без текста и кавычек в начале: [{"title":"Название","year":2024,"desc":"описание"}]`
                        }]
                    })
                });

                const data = await response.json();
                let content = data.choices[0].message.content;
                
                // Очистка от Markdown (если AI прислал ```json)
                content = content.replace(/```json|```/g, '').trim();
                const movies = JSON.parse(content);

                container.empty();
                movies.forEach(movie => {
                    const item = $(`
                        <div class="movie-item selector" style="padding: 1rem; background: rgba(255,255,255,0.05); margin-bottom: 0.5rem; border-radius: 0.5rem;">
                            <div style="color: #ff6b35; font-weight: bold;">${movie.title} (${movie.year})</div>
                            <div style="font-size: 0.8rem; opacity: 0.6;">${movie.desc}</div>
                        </div>
                    `);

                    item.on('hover:enter click', () => {
                        Lampa.Modal.close();
                        Lampa.Search.trigger(`${movie.title} ${movie.year}`);
                    });

                    container.append(item);
                });

                // Обновляем навигацию пульта
                Lampa.Controller.toggle('ai_modal');

            } catch (e) {
                console.error(e);
                container.html('<div style="color: #ff4444;">Ошибка: проверьте ключ API или прокси</div>');
            }
        }
    };

    // Запуск
    if (window.appready) Lampa.Plugins.AISearch.init();
    else Lampa.Listener.follow('app', (e) => { if (e.type === 'ready') Lampa.Plugins.AISearch.init(); });

})();


})();
