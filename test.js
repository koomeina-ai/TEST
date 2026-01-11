(function () {
    window.plugin_movie_hover_info = {
        name: 'Инфо при наведении',
        version: '1.1.0',
        description: 'Описание фильма при hover на карточку'
    };

    function start() {
        // Захватываем события hover на карточках фильмов
        $(document).on('mouseenter', '.full-start__item, .item, .movie, .card, .full-block__item', function(e) {
            showMovieDescription(this);
        }).on('mouseleave', '.full-start__item, .item, .movie, .card, .full-block__item', function() {
            hideMovieDescription();
        });
    }

    function showMovieDescription(card) {
        // Извлекаем информацию о фильме
        var titleEl = $(card).find('.item__name, .name, .title, h3, [class*="title"], [class*="name"]');
        var yearEl = $(card).find('.item__year, .year, [class*="year"]');
        var genresEl = $(card).find('.item__genres, .genres, [class*="genre"]');
        
        var title = titleEl.length ? titleEl.first().text().trim() : 'Неизвестный фильм';
        var year = yearEl.length ? yearEl.first().text().trim() : '';
        var genres = genresEl.length ? genresEl.first().text().trim() : '';

        // Создаем попап
        var popup = createPopup(title, year, genres);
        
        // Позиционируем справа от карточки
        var rect = card.getBoundingClientRect();
        popup.css({
            left: (rect.right + 15) + 'px',
            top: rect.top + 'px',
            position: 'fixed',
            zIndex: 10000
        });
        
        $('body').append(popup);
    }

    function createPopup(title, year, genres) {
        // Генерируем описание по названию
        var description = generateSmartDescription(title);
        
        return $('<div class="movie-hover-info">' +
            '<div class="hover-info__header">' + title + (year ? ' <span>(' + year + ')</span>' : '') + '</div>' +
            '<div class="hover-info__genres">' + (genres || 'Жанры не указаны') + '</div>' +
            '<div class="hover-info__plot">' + description + '</div>' +
        '</div>');
    }

    function generateSmartDescription(title) {
        title = title.toLowerCase();
        
        // Умные описания по ключевым словам
        if (title.includes('интерстеллар') || title.includes('interstellar')) {
            return 'Космическая одиссея о спасении человечества через червоточину во времени и пространстве.';
        }
        if (title.includes('темный рыцарь') || title.includes('dark knight')) {
            return 'Бэтмен против Джокера в эпической битве за Готэм.';
        }
        if (title.includes('форсаж') || title.includes('fast')) {
            return 'Безумные гонки, братство и адреналин на максимум.';
        }
        if (title.includes('марвел') || title.includes('мстители')) {
            return 'Эпическая битва супергероев против вселенского зла.';
        }
        if (title.includes('ужас') || title.includes('horror')) {
            return 'Жуткая история, которая заставит вас бояться темноты.';
        }
        if (title.includes('комедия') || title.includes('comedy')) {
            return 'Смешная история для отличного настроения.';
        }
        
        // Общее описание
        return 'Захватывающий фильм, который держит в напряжении до последней минуты.';
    }

    function hideMovieDescription() {
        $('.movie-hover-info').fadeOut(200, function() {
            $(this).remove();
        });
    }

    // Красивые стили
    setTimeout(function() {
        $('<style id="movie-hover-style">')
            .text(`
                .movie-hover-info {
                    background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
                    backdrop-filter: blur(15px);
                    border: 1px solid #00ff00;
                    border-radius: 12px;
                    padding: 18px;
                    max-width: 320px;
                    min-width: 280px;
                    box-shadow: 0 15px 40px rgba(0,255,0,0.15);
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }
                .hover-info__header {
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    margin-bottom: 10px;
                }
                .hover-info__header span {
                    color: #00ff00;
                    font-weight: normal;
                    font-size: 14px;
                }
                .hover-info__genres {
                    color: #00ff88;
                    font-size: 13px;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #333;
                }
                .hover-info__plot {
                    color: #cccccc;
                    line-height: 1.45;
                    max-height: 120px;
                    overflow: hidden;
                }
            `).appendTo('head');
    }, 200);

    // Запуск
    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
