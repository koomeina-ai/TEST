(function () {
    window.plugin_actor_search = {
        name: 'Поиск по актёрам',
        version: '1.0.0',
        description: 'Добавляет поиск по актёрам в меню поиска'
    };

    const TMDB_API_KEY = 'f2c4932089dbdce7a6ccf0c21087eab6';

    function start() {
        // Перехватываем открытие поиска
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'search_open') {
                addActorSearchOption();
            }
        });

        // Добавляем кнопку в настройки
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                var actorItem = $('<div class="settings-param selector actor-search-selector">' +
                    '<div class="settings-param__name">🎭 Поиск по актёрам</div>' +
                    '<div class="settings-param__value">TMDB</div>' +
                    '<div class="settings-param__descr">В меню поиска</div>' +
                '</div>');

                actorItem.on('hover:enter', function() {
                    Lampa.Noty.show('🎭 Поиск по актёрам уже в меню поиска!');
                });

                e.body.find('[data-name="interface_size"]').after(actorItem);
            }
        });
    }

    function addActorSearchOption() {
        // Находим стандартное меню поиска
        setTimeout(() => {
            var searchPanel = $('.search__input-wrapper, .search-box, [class*="search"]');
            
            if (searchPanel.length) {
                // Добавляем кнопку "Поиск по актёру" 
                var actorBtn = $('<div class="search__actor-btn selector actor-search-btn">' +
                    '<div class="search__actor-icon">🎭</div>' +
                    '<div class="search__actor-text">Поиск по актёру</div>' +
                '</div>');

                actorBtn.on('hover:enter', function() {
                    showActorSearch();
                });

                // Добавляем если еще нет
                if (!$('.search__actor-btn').length) {
                    searchPanel.after(actorBtn);
                }
            }
        }, 300);
    }

    function showActorSearch() {
        Lampa.Input.edit({
            title: '🔍 Введите имя актёра',
            value: '',
            onEnter: async function(value) {
                if (value.length < 2) {
                    Lampa.Noty.show('Введите минимум 2 символа');
                    return;
                }

                // Показываем индикатор загрузки
                Lampa.Noty.show('🔍 Поиск актёра...');

                try {
                    var actors = await searchActors(value);
                    showActorsList(actors);
                } catch(e) {
                    Lampa.Noty.show('Ошибка поиска. Проверьте интернет.');
                }
            },
            onCancel: function() {}
        });
    }

    async function searchActors(query) {
        var url = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`;
        
        var response = await fetch(url);
        var data = await response.json();
        
        return data.results.slice(0, 20); // Топ 20 актёров
    }

    function showActorsList(actors) {
        var items = [{
            title: '🎭 Найдено актёров: ' + actors.length,
            separator: true
        }];

        actors.forEach(function(actor) {
            var moviesCount = actor.known_for ? actor.known_for.length : 0;
            
            items.push({
                title: `🎬 ${actor.name}`,
                subtitle: `${moviesCount} фильмов • ${actor.known_for_department}`,
                img: `https://image.tmdb.org/t/p/w200${actor.profile_path}`,
                onSelect: function() {
                    showActorMovies(actor);
                }
            });
        });

        Lampa.Select.show({
            title: '🎭 Выберите актёра',
            items: items,
            onBack: function() {
                addActorSearchOption();
            }
        });
    }

    async function showActorMovies(actor) {
        Lampa.Noty.show(`🎬 Фильмы ${actor.name}...`);

        try {
            // Получаем фильмы актёра
            var moviesUrl = `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${TMDB_API_KEY}&language=ru-RU`;
            var moviesResp = await fetch(moviesUrl);
            var moviesData = await moviesResp.json();
            
            var items = [];
            moviesData.cast.slice(0, 50).forEach(function(movie) {
                items.push({
                    title: movie.title,
                    subtitle: new Date(movie.release_date).getFullYear(),
                    descr: movie.character,
                    img: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
                    onSelect: function() {
                        openMovieInLampa(movie);
                    }
                });
            });

            Lampa.Select.show({
                title: `🎬 Фильмы ${actor.name}`,
                items: items,
                onBack: function() {
                    showActorsList([actor]);
                }
            });
        } catch(e) {
            Lampa.Noty.show('Ошибка загрузки фильмов');
        }
    }

    function openMovieInLampa(movie) {
        // Открываем стандартный поиск Lampa по названию
        Lampa.Search.start({
            query: movie.title
        });
    }

    // Стили
    $('<style id="actor-search-style">').text(`
        .search__actor-btn {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            background: #1a1a1a;
            border: 1px solid #00ff41;
            border-radius: 8px;
            margin: 8px 0;
            cursor: pointer;
        }
        .search__actor-btn.focus, .search__actor-btn.hover {
            box-shadow: 0 0 0 3px #00ff00 !important;
            background: #00ff41 !important;
            color: #000 !important;
        }
        .search__actor-icon {
            font-size: 20px;
            margin-right: 10px;
        }
        .search__actor-text {
            font-size: 15px;
            font-weight: 500;
        }
        .actor-search-selector.focus, .actor-search-selector.hover {
            box-shadow: 0 0 0 3px #00ff00 !important;
            border-radius: 6px !important;
        }
    `).appendTo('head');

    if (window.appready) start();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type == 'ready') start();
    });
})();
