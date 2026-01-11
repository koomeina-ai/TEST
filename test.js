(function () {
    window.plugin_tmdb_hover = {
        name: 'TMDB Инфо',
        version: '1.2.0',
        description: 'Реальные данные TMDB при наведении'
    };

    // БЕСПЛАТНЫЙ TMDB API ключ (public)
    const TMDB_API_KEY = 'f2c4932089dbdce7a6ccf0c21087eab6';
    let cache = {};
    let currentRequest = null;

    function start() {
        // Захват hover событий на карточках
        $(document).on('mouseenter', '.full-start__item, .item, .movie, .card, .full-block__item', function(e) {
            showTmdbInfo(this);
        }).on('mouseleave', '.full-start__item, .item, .movie, .card, .full-block__item', function() {
            hideTmdbInfo();
        });
    }

    async function showTmdbInfo(card) {
        var title = $(card).find('.item__name, .name, .title, h3').first().text().trim();
        var year = $(card).find('.item__year, .year').first().text().match(/\d{4}/)?.[0];

        if (!title || cache[title + year]) return;

        // Показываем "Загрузка..."
        showLoadingPopup(title, year);
        
        try {
            // Поиск по TMDB
            var tmdbData = await searchTmdb(title, year);
            cache[title + year] = tmdbData;
            showTmdbPopup(tmdbData, card);
        } catch(e) {
            showFallbackPopup(title, year);
        }
    }

    async function searchTmdb(title, year) {
        // Сначала поиск фильма
        var searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}&language=ru-RU`;
        
        var searchResp = await fetch(searchUrl);
        var searchData = await searchResp.json();
        
        if (searchData.results && searchData.results[0]) {
            var movieId = searchData.results[0].id;
            
            // Получаем полную информацию
            var detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ru-RU&append_to_response=credits`;
            var detailsResp = await fetch(detailsUrl);
            return await detailsResp.json();
        }
        
        throw new Error('Фильм не найден');
    }

    function showLoadingPopup(title, year) {
        var popup = createPopup(title, year, '🔄 Загрузка с TMDB...', '');
        positionPopup(popup);
        $('body').append(popup);
    }

    function showTmdbPopup(data, card) {
        $('.tmdb-hover-info').remove();
        
        var title = data.title || data.name;
        var year = new Date(data.release_date).getFullYear();
        var overview = data.overview || 'Описание отсутствует';
        var rating = data.vote_average ? Math.round(data.vote_average * 10) : '?';
        var genres = data.genres ? data.genres.map(g => g.name).join(', ') : '';
        var director = data.credits?.crew?.find(c => c.job === 'Director')?.name || '';

        var popup = createPopup(
            title, 
            year, 
            `${rating}/10 • ${genres}`,
            overview,
            director
        );
        
        positionPopup(popup, card);
        $('body').append(popup);
    }

    function showFallbackPopup(title, year) {
        $('.tmdb-hover-info').remove();
        var popup = createPopup(title, year, 'Информация недоступна', 'Попробуйте позже');
        positionPopup(popup);
        $('body').append(popup);
    }

    function createPopup(title, year, subtitle, description, director = '') {
        return $('<div class="tmdb-hover-info">' +
            `<div class="tmdb__header">${title} <span class="year">(${year})</span></div>` +
            `<div class="tmdb__subtitle">${subtitle}</div>` +
            (director ? `<div class="tmdb__director">Режиссер: ${director}</div>` : '') +
            `<div class="tmdb__plot">${description}</div>` +
        '</div>');
    }

    function positionPopup(popup, card = null) {
        popup.css({
            position: 'fixed',
            zIndex: 10000,
            left: '10px',
            right: '10px',
            maxWidth: '400px',
            margin: '0 auto'
        });
        
        if (card) {
            var rect = card.getBoundingClientRect();
            popup.css({
                left: (rect.right + 15) + 'px',
                top: rect.top + 'px',
                maxWidth: '350px'
            });
        }
    }

    function hideTmdbInfo() {
        $('.tmdb-hover-info').fadeOut(300, function() {
            $(this).remove();
        });
    }

    // Красивые стили
    $('<style id="tmdb-hover-style">').text(`
        .tmdb-hover-info {
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            backdrop-filter: blur(20px);
            border: 1px solid #00ff41;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0,255,65,0.2);
            font-family: -apple-system, Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .tmdb__header {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
        }
        .tmdb__header .year {
            color: #00ff41;
            font-weight: 400;
            font-size: 16px;
        }
        .tmdb__subtitle {
            color: #00ff88;
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .tmdb__director {
            color: #88ff88;
            font-size: 13px;
            margin-bottom: 12px;
            font-style: italic;
        }
        .tmdb__plot {
            color: #d1d5db;
            font-size: 14px;
            line-height: 1.5;
            max-height: 140px;
            overflow: hidden;
        }
    `).appendTo('head');

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
