(function () {
    window.plugin_smart_search = {
        name: 'Умный поиск',
        version: '1.0.0',
        description: 'Поиск по актёрам + темам в меню поиска'
    };

    const TMDB_API_KEY = 'f2c4932089dbdce7a6ccf0c21087eab6';

    function start() {
        // Перехватываем открытие поиска
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'search_open') {
                addSmartSearchOptions();
            }
        });

        // Кнопка в настройках (информационная)
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                var smartItem = $('<div class="settings-param selector smart-search-selector">' +
                    '<div class="settings-param__name">🧠 Умный поиск</div>' +
                    '<div class="settings-param__value">Актёры + Темы</div>' +
                    '<div class="settings-param__descr">В меню поиска</div>' +
                '</div>');

                smartItem.on('hover:enter', function() {
                    Lampa.Noty.show('🧠 Актёры и темы уже в меню поиска!');
                });

                e.body.find('[data-name="interface_size"]').after(smartItem);
            }
        });
    }

    function addSmartSearchOptions() {
        setTimeout(() => {
            var searchPanel = $('.search__input-wrapper, .search-box, [class*="search"]');
            
            if (searchPanel.length && !$('.search__theme-btn').length) {
                // КНОПКА АКТЁРОВ (как в вашем рабочем варианте)
                if (!$('.search__actor-btn').length) {
                    var actorBtn = $('<div class="search__actor-btn selector actor-search-btn">' +
                        '<div class="search__actor-icon">🎭</div>' +
                        '<div class="search__actor-text">Поиск по актёру</div>' +
                    '</div>');

                    actorBtn.on('hover:enter', function() {
                        showActorSearch();
                    });

                    searchPanel.after(actorBtn);
                }

                // НОВАЯ КНОПКА ТЕМЫ
                var themeBtn = $('<div class="search__theme-btn selector theme-search-btn">' +
                    '<div class="search__theme-icon">🌌</div>' +
                    '<div class="search__theme-text">Поиск по теме</div>' +
                '</div>');

                themeBtn.on('hover:enter', function() {
                    showThemeSearch();
                });

                searchPanel.after(themeBtn);
            }
        }, 300);
    }

    // === ПОИСК ПО АКТЁРАМ (ваш рабочий код) ===
    function showActorSearch() {
        Lampa.Input.edit({
            title: '🔍 Введите имя актёра',
            value: '',
            onEnter: async function(value) {
                if (value.length < 2) {
                    Lampa.Noty.show('Введите минимум 2 символа');
                    return;
                }
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
        return data.results.slice(0, 20);
    }

    function showActorsList(actors) {
        var items = [{title: '🎭 Найдено актёров: ' + actors.length, separator: true}];
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
                addSmartSearchOptions();
            }
        });
    }

    async function showActorMovies(actor) {
        Lampa.Noty.show(`🎬 Фильмы ${actor.name}...`);
        try {
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
        Lampa.Search.start({query: movie.title});
    }

    // === НОВЫЙ ПОИСК ПО ТЕМАМ ===
    function showThemeSearch() {
        Lampa.Select.show({
            title: '🌌 Выберите тему',
            items: [
                {title: '🚀 Космос',       query: 'space космос интерстеллар марс'},
                {title: '⚔️ Средневековье', query: 'medieval рыцари короли замки игла'},
                {title: '🦸 Супергерои',   query: 'marvel dc мстители супергерои'},
                {title: '🧟 Зомби',        query: 'zombie зомби walking dead'},
                {title: '💀 Мафия',        query: 'mafia мафия гангстеры крёстный'},
                {title: '🎯 Шпионы',       query: 'spy шпион bond kingsman'},
                {title: '🏃 Погони',       query: 'fast chase форсаж погони'},
                {title: '👻 Призраки',     query: 'ghost призрак haunted паранормальный'},
                {title: '💎 Ограбления',   query: 'heist ограбление bank'},
                {title: '❤️ Романтика',    query: 'romance любовь романтический мелодрама'},
                {title: '😂 Комедии',      query: 'comedy комедия смешно юмор'},
                {title: '😱 Триллеры',    query: 'thriller триллер suspense'}
            ],
            onSelect: function(item) {
                Lampa.Search.start({query: item.query});
            },
            onBack: function() {
                addSmartSearchOptions();
            }
        });
    }

    // Стили (расширенные для двух кнопок)
    $('<style id="smart-search-style">').text(`
        .search__actor-btn, .search__theme-btn {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            background: #1a1a1a;
            border: 1px solid #00ff41;
            border-radius: 8px;
            margin: 8px 5px;
            cursor: pointer;
            flex: 1;
        }
        .search__actor-btn.focus, .search__actor-btn.hover,
        .search__theme-btn.focus, .search__theme-btn.hover {
            box-shadow: 0 0 0 3px #00ff00 !important;
            background: #00ff41 !important;
            color: #000 !important;
        }
        .search__actor-icon, .search__theme-icon {
            font-size: 20px;
            margin-right: 10px;
        }
        .search__actor-text, .search__theme-text {
            font-size: 15px;
            font-weight: 500;
        }
        .smart-search-selector.focus, .smart-search-selector.hover {
            box-shadow: 0 0 0 3px #00ff00 !important;
            border-radius: 6px !important;
        }
    `).appendTo('head');

    if (window.appready) start();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type == 'ready') start();
    });
})();
