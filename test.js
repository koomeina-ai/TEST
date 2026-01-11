(function () {
    window.plugin_movie_info = {
        name: 'Инфо о фильме',
        version: '1.0.0',
        description: 'Описание при наведении на карточку'
    };

    let infoTimeout;

    function start() {
        // Перехватываем события наведения на карточки фильмов
        Lampa.Listener.follow('mouseenter', function(e) {
            if (e.target.closest('.full-start__item') || 
                e.target.closest('.item') || 
                e.target.closest('.movie')) {
                showMovieInfo(e.target);
            }
        });

        Lampa.Listener.follow('mouseleave', function(e) {
            if (infoTimeout) {
                clearTimeout(infoTimeout);
                hideMovieInfo();
            }
        });

        // Добавляем кнопку в настройки Интерфейс
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var infoItem = $('<div class="settings-param selector movie-info-selector">' +
                    '<div class="settings-param__name">🎬 Инфо при наведении</div>' +
                    '<div class="settings-param__value">На карточки фильмов</div>' +
                    '<div class="settings-param__descr">Показывает описание</div>' +
                '</div>');

                infoItem.on('hover:enter', function() {
                    toggleInfoPlugin();
                });

                e.body.find('[data-name="interface_size"]').after(infoItem);
            }
        });
    }

    function showMovieInfo(element) {
        if (!Lampa.Storage.get('movie_info_enabled', 'true')) return;

        var movieCard = element.closest('.full-start__item, .item, .movie');
        if (!movieCard.length) return;

        // Извлекаем данные о фильме
        var title = movieCard.find('.item__name, .movie__title, h3').first().text().trim();
        var year = movieCard.find('.item__year, .movie__year').first().text().trim();
        var genres = movieCard.find('.item__genres, .movie__genres').first().text().trim();

        if (!title) return;

        // Создаем попап
        var popup = createInfoPopup(title, year, genres);
        
        // Позиционируем рядом с карточкой
        var rect = movieCard[0].getBoundingClientRect();
        popup.css({
            left: rect.right + 10 + 'px',
            top: rect.top + 'px',
            position: 'fixed',
            zIndex: 9999
        });

        $('body').append(popup);
        
        // Убираем через 5 сек
        infoTimeout = setTimeout(hideMovieInfo, 5000);
    }

    function createInfoPopup(title, year, genres) {
        // Генерируем краткое описание (можно расширить API)
        var description = generateDescription(title, year, genres);
        
        return $('<div class="movie-info-popup">' +
            '<div class="movie-info__title">' + title + (year ? ' (' + year + ')' : '') + '</div>' +
            '<div class="movie-info__genres">' + (genres || 'Жанр: не указан') + '</div>' +
            '<div class="movie-info__desc">' + description + '</div>' +
        '</div>');
    }

    function generateDescription(title, year, genres) {
        // Примеры описаний по жанрам
        var descTemplates = {
            'драма': 'Глубокая драматическая история о человеческих судьбах.',
            'комедия': 'Забавная история, которая заставит вас смеяться.',
            'триллер': 'Напряженный сюжет держит в постоянном напряжении.',
            'ужасы': 'Жуткая история, от которой мурашки по коже.',
            'боевик': 'Динамичный экшен с погонями и драками.'
        };

        if (genres) {
            for (let genre in descTemplates) {
                if (genres.toLowerCase().includes(genre)) {
                    return descTemplates[genre];
                }
            }
        }

        return 'Интересный фильм, который стоит посмотреть!';
    }

    function hideMovieInfo() {
        $('.movie-info-popup').remove();
    }

    function toggleInfoPlugin() {
        var enabled = Lampa.Storage.get('movie_info_enabled', 'true') === 'true';
        Lampa.Storage.set('movie_info_enabled', (!enabled).toString());
        
        Lampa.Noty.show({
            title: enabled ? '🎬 Отключено' : '🎬 Включено',
            body: 'Инфо при наведении',
            time: 2000
        });
    }

    // Стили для попапа
    setTimeout(function() {
        $('<style id="movie-info-style">')
            .text(`
                .movie-info-popup {
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 15px;
                    max-width: 300px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    font-family: Arial, sans-serif;
                }
                .movie-info__title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 8px;
                }
                .movie-info__genres {
                    color: #00ff00;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .movie-info__desc {
                    font-size: 13px;
                    color: #ccc;
                    line-height: 1.4;
                }
                .movie-info-selector.focus, .movie-info-selector.hover {
                    box-shadow: 0 0 0 3px #00ff00 !important;
                    border-radius: 6px !important;
                }
            `).appendTo('head');
    }, 100);

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
