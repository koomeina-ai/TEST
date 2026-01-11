(function() {
    'use strict';

    function addTopMenuButton() {
        console.log('Top Menu Button Plugin Loaded');

        // Ждем, пока прорисуется верхнее меню (класс .header)
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                var header = $('.header');
                
                if (header.length) {
                    // Создаем новый элемент кнопки
                    var newButton = $('<div>')
                        .addClass('header__item selector') // Используем стандартные классы Lampa
                        .attr('data-action', 'my_custom_hello_button')
                        .html('Привет!'); // Текст кнопки

                    // Обработчик события нажатия/выбора на пульте
                    newButton.on('hover:enter', function() {
                        Lampa.Noty.show('Вы нажали на мою кастомную кнопку!');
                    });

                    // Добавляем кнопку в контейнер верхнего меню
                    header.find('.header__content').append(newButton);

                    Lampa.Noty.show('Кнопка "Привет!" добавлена в верхнее меню.');
                }
            }
        });
    }

    // Запуск плагина после полной загрузки приложения Lampa
    if (window.appready) addTopMenuButton();
    else Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') addTopMenuButton();
    });
})();
