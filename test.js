(function () {
    'use strict';

    var api = {
        // Публичный TMDB search/multi без ключа, поиск по ключевым словам
        async search(query, page) {
            var url = 'https://api.themoviedb.org/3/search/multi?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=ru-RU&query=' + encodeURIComponent(query) + '&page=' + page;
            try {
                var response = await fetch(url);
                var json = await response.json();
                return json.results || [];
            } catch (e) {
                Lampa.Noty.show('Ошибка поиска TMDB: ' + e.message);
                return [];
            }
        }
    };

    // Добавляем в меню поиска (hooks на createCategoryMenu или search)
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            // Добавляем кнопку в поисковую панель или меню
            var searchHtml = $('.search__input').parent();
            if (searchHtml.length) {
                $('<div class="search__input-button selector" style="margin-left:10px;">AI Поиск</div>').click(function () {
                    var keywords = prompt('Введите описание (ключевые слова, напр. "море пираты приключения"):');
                    if (!keywords) return;
                    Lampa.Activity.push({
                        url: '',
                        title: 'Поиск по описанию - ' + keywords,
                        component: 'full',
                        search: keywords,
                        search_one: keywords,
                        search_two: '',
                        page: 1,
                        genres: [],
                        filter() {
                            return api.search(keywords, this.page);
                        },
                        html() {
                            // Стандартный HTML для карточек из Lampa
                            return Lampa.Template.get('full_start.html', this.render());
                        }
                    });
                }).appendTo(searchHtml);
            }
        }
    });

    // Добавляем в каталог как отдельный пункт (если меню)
    Lampa.Listener.follow('full', function (e) {
        if (e.type == 'complite') {
            // Интеграция в меню поиска
            $('.view--search .category__menu .full-start__buttons-add').append(
                '<div class="selector" onclick="openKeywordSearch()">Поиск по описанию</div>'
            );
        }
    });

    window.openKeywordSearch = function() {
        var keywords = prompt('Описание для поиска:');
        if (keywords) {
            // Запуск поиска
            var params = {search: keywords, search_one: keywords};
            Controller.toContent(params);
        }
    };

})();

