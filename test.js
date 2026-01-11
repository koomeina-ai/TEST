(function() {
    'use strict';

    function startVisualPlugin() {
        console.log('Visual Modification Plugin Loaded');

        // Ждем, когда меню будет готово, и меняем цвета
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                // Находим все стандартные пункты меню, кроме нашей кнопки "Выход"
                $('body').find('.menu__item').each(function() {
                    // Используем jQuery .css() для изменения стилей
                    if (!$(this).is('[data-action="exit_app"]')) {
                        // Меняем цвет текста и иконки на синий (например, #00BFFF - SkyBlue)
                        $(this).find('.menu__text').css('color', '#00BFFF');
                        $(this).find('.menu__ico svg').css('fill', '#00BFFF');
                    }
                });

                Lampa.Noty.show('Визуальный плагин загружен: Меню стало синим!');
            }
        });
    }

    // Запуск плагина после загрузки приложения
    if (window.appready) startVisualPlugin();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') startVisualPlugin();
    });
})();
