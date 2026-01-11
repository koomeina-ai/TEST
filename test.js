(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта',
        version: '1.0.0',
        description: 'Позволяет изменять размер шрифта интерфейса'
    };

    function start() {
        // Добавляем настройки в раздел "Интерфейс"
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var item = $('<div class="settings-param selector" data-type="range" data-name="font_size_value" data-min="10" data-max="30" data-step="1">' +
                    '<div class="settings-param__name">Размер шрифта</div>' +
                    '<div class="settings-param__value"></div>' +
                    '<div class="settings-param__descr">Установите комфортный размер текста (стандарт 16px)</div>' +
                '</div>');

                item.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Размер шрифта',
                        items: [
                            {title: 'Мелкий (14px)', value: 14},
                            {title: 'Обычный (16px)', value: 16},
                            {title: 'Средний (18px)', value: 18},
                            {title: 'Крупный (20px)', value: 20},
                            {title: 'Очень крупный (24px)', value: 24}
                        ],
                        onSelect: function (a) {
                            Lampa.Storage.set('font_size_value', a.value);
                            applySize(a.value);
                            Lampa.Settings.update();
                        }
                    });
                });

                // Добавляем зеленое обрамление для активного состояния
                item.addClass('font-size-selector');

                e.body.find('[data-name="interface_size"]').after(item);
            }
        });

        function applySize(size) {
            var val = size || Lampa.Storage.get('font_size_value', '16');
            var style = $('#plugin-font-size-style');
            if (!style.length) {
                style = $('<style id="plugin-font-size-style"></style>').appendTo('head');
            }
            
            // Стили для шрифта и зеленого обрамления кнопки
            style.text(`
                html, body { 
                    font-size: ${val}px !important; 
                }
                .font-size-selector.selector.focus,
                .font-size-selector.selector.hover {
                    box-shadow: 0 0 0 2px #00ff00 !important;
                    border-radius: 4px !important;
                }
                .font-size-selector.selector.focus .settings-param__name,
                .font-size-selector.selector.hover .settings-param__name {
                    color: #ffffff !important;
                }
            `);
        }

        applySize();
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
