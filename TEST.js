(function () {
    'use strict';

    function startPlugin() {
        // Добавляем стиль для желтого цвета
        $('<style>')
            .prop('type', 'text/css')
            .html('.menu__item[data-action="exit_app"] { color: #ffeb3b !important; } .menu__item[data-action="exit_app"] svg { fill: #ffeb3b !important; }')
            .appendTo('head');

        var menu_item = {
            title: 'Выход',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="www.w3.org"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>',
            id: 'exit_app'
        };

        // Ждем готовности приложения
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                var menu = $('body').find('.menu__list');
                var item = $('<li class="menu__item selector" data-action="exit_app">' +
                    '<div class="menu__ico">' + menu_item.icon + '</div>' +
                    '<div class="menu__text">' + menu_item.title + '</div>' +
                    '</li>');

                item.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Выход',
                        items: [
                            {title: 'Да, выйти', exit: true},
                            {title: 'Отмена', exit: false}
                        ],
                        onSelect: function (a) {
                            if (a.exit) {
                                if (typeof tizen !== 'undefined') tizen.application.getCurrentApplication().exit();
                                else if (typeof webOS !== 'undefined') window.close();
                                else if (navigator.app && navigator.app.exitApp) navigator.app.exitApp();
                                else window.close();
                            } else {
                                Lampa.Controller.toggle('menu'); // Возвращаемся в меню
                            }
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('menu');
                        }
                    });
                });

                menu.append(item);
            }
        });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') startPlugin();
    });
})();
