(function() {
    'use strict';

    function addVisualElement() {
        console.log('Visual Addition Plugin Loaded');

        // Создаем новый HTML-элемент с красным текстом
        var visualElement = $('<div>')
            .text('✅ МОЙ ПЛАГИН РАБОТАЕТ!')
            .css({
                'position': 'fixed',
                'bottom': '20px',
                'right': '20px',
                'color': 'red', // Делаем текст красным
                'font-size': '24px',
                'background-color': 'rgba(0, 0, 0, 0.7)',
                'padding': '10px',
                'z-index': '10000'
            })
            .attr('id', 'my-test-visual-element'); // Даем ID для контроля

        // Добавляем элемент в тело документа
        $('body').append(visualElement);
        
        Lampa.Noty.show('Плагин загружен: Красная надпись добавлена!');
    }

    // Запуск плагина после полной загрузки приложения Lampa
    if (window.appready) addVisualElement();
    else Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') addVisualElement();
    });
})();
