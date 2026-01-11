(function () {
    window.plugin_smart_search = {
        name: 'Умный поиск',
        version: '1.1.0',
        description: 'Поиск по актёрам + темам фильмов'
    };

    const TMDB_API_KEY = 'f2c4932089dbdce7a6ccf0c21087eab6';

    function start() {
        // Перехватываем открытие поиска
        setTimeout(() => {
            overrideSearch();
        }, 1000);

        // Кнопка в настройках (информационная)
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                var smartItem = $('<div class="settings-param selector smart-search-selector">' +
                    '<div class="settings-param__name">🧠 Умный поиск</div>' +
                    '<div class="settings-param__value">Актёры + Темы</div>' +
                    '<div class="settings-param__descr">В меню поиска</div>' +
                '</div>');

                smartItem.on('hover:enter', function() {
                    Lampa.Noty.show('🧠 Уже в меню поиска: актёры + темы!');
                });

                e.body.find('[data-name="interface_size"]').after(smartItem);
            }
        });
    }

    function overrideSearch() {
        // Находим панель поиска и добавляем кнопки
        var searchPanels = $('.search, .search-box, .head-search, [class*="search"]');
        
        searchPanels.each(function() {
            if (!$(this).find('.smart-search-btn').length) {
                // Кнопка "Поиск по актёру"
                var actorBtn = $('<div class="smart-search-btn selector actor-btn">' +
                    '<div class="btn-icon">🎭</div><div>Актёр</div>' +
                '</div>');
                actorBtn.on('hover:enter', () => showActorSearch());

                // Кнопка "Поиск по теме"
                var themeBtn = $('<div class="smart-search-btn selector theme-btn">' +
                    '<div class="btn-icon">🌌</div><div>Тема</div>' +
                '</div>');
                themeBtn.on('hover:enter', () => showThemeSearch());

                $(this).append('<div class="smart-search-buttons"></div>')
                       .find('.smart-search-buttons').append(actorBtn, themeBtn);
            }
        });
    }

    // === ПОИСК ПО АКТЁРАМ ===
    function showActorSearch() {
        Lampa.Input.edit({
            title: '🎭 Имя актёра',
            value: '',
            onEnter: async (value) => {
                if (value.length < 2) return Lampa.Noty.show('Минимум 2 символа');
                await searchActors(value);
            }
        });
    }

    async function searchActors(query) {
        Lampa.Noty.show('🔍 Ищем актёров...');
        
        try {
            var url = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`;
            var data = await (await fetch(url)).json();
            
            showActorsList(data.results);
        } catch(e) {
            Lampa.Noty.show('Ошибка поиска');
        }
    }

    // === ПОИСК ПО ТЕМАМ ===
    function showThemeSearch() {
        Lampa.Select.show({
            title: '🌌 Поиск по темам',
            items: [
                {title: '🚀 Космос',        search: 'space OR космос OR interstellar OR mars'},
                {title: '⚔️ Средневековье', search: 'medieval OR рыцари OR короли OR замки'},
                {title: '🦸 Супергерои',   search: 'marvel OR dc OR супергерои OR мстители'},
                {title: '🧟 Зомби',        search: 'zombie OR зомби OR walking dead'},
                {title: '💀 Мафия',        search: 'mafia OR мафия OR гангстеры OR godfather'},
                {title: '🎯 Шпионы',       search: 'spy OR шпион OR bond OR kingsman'},
                {title: '🏃 Погони',       search: 'chase OR fast OR форсаж OR погони'},
                {title: '👻 Призраки',     search: 'ghost OR призрак OR haunted'},
                {title: '💎 Ограбления',   search: 'heist OR ограбление OR bank'},
                {title: '❤️ Романтика',    search: 'romance OR любовь OR романтический'},
                {title: '😂 Комедии',      search: 'comedy OR комедия OR смешно'},
                {title: '😱 Триллеры',    search: 'thriller OR триллер OR suspense'}
            ],
            onSelect: (item) => {
                Lampa.Search.start({query: item.search});
            }
        });
    }

    function showActorsList(actors) {
        var items = [{separator: true, title: `🎭 Актёров: ${actors.length}` }];
        
        actors.slice(0, 15).forEach(actor => {
            var movies = actor.known_for?.length || 0;
            items.push({
                title: actor.name,
                subtitle: `${movies} фильмов • ${actor.known_for_department}`,
                img: `https://image.tmdb.org/t/p/w200${actor.profile_path}`,
                onSelect: () => showActorMovies(actor)
            });
        });

        Lampa.Select.show({
            title: '🎭 Выберите актёра',
            items: items
        });
    }

    async function showActorMovies(actor) {
        try {
            var url = `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${TMDB_API_KEY}&language=ru-RU`;
            var data = await (await fetch(url)).json();
            
            var items = data.cast.slice(0, 30).map(movie => ({
                title: movie.title,
                subtitle: `${new Date(movie.release_date).getFullYear()} • ${movie.character}`,
                onSelect: () => Lampa.Search.start({query: movie.title})
            }));

            Lampa.Select.show({
                title: `🎬 Фильмы ${actor.name}`,
                items: items
            });
        } catch(e) {
            Lampa.Noty.show('Ошибка загрузки');
        }
    }

    // Красивые стили
    $('<style id="smart-search-style">').text(`
        .smart-search-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding: 10px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
        }
        .smart-search-btn {
            flex: 1;
            padding: 12px;
            background: #1a1a1a;
            border: 2px solid #00ff41;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
        }
        .smart-search-btn.focus, .smart-search-btn.hover {
            box-shadow: 0 0 0 3px #00ff00 !important;
            background: #00ff41 !important;
            color: #000 !important;
            transform: scale(1.05);
        }
        .smart-search-btn .btn-icon {
            font-size: 20px;
            display: block;
            margin-bottom: 5px;
        }
        .smart-search-selector.focus, .smart-search-selector.hover {
            box-shadow: 0 0 0 3px #00ff00 !important;
            border-radius: 6px !important;
        }
    `).appendTo('head');

    // Автообновление поиска при переходах
    Lampa.Listener.follow('app', function(e) {
        if (e.type == 'ready' || e.type == 'activity') {
            setTimeout(overrideSearch, 500);
        }
    });

    if (window.appready) start();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type == 'ready') start();
    });
})();
