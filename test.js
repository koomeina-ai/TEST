(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта',
        version: '1.1.0',
        description: 'Позволяет изменять размер шрифта интерфейса с выбором модели'
    };

    function start() {
        // Добавляем настройки в раздел "Интерфейс"
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var item = $('<div class="settings-param selector font-size-selector" data-type="range" data-name="font_size_value" data-min="8" data-max="32" data-step="1">' +
                    '<div class="settings-param__name">Размер шрифта</div>' +
                    '<div class="settings-param__value"></div>' +
                    '<div class="settings-param__descr">Установите комфортный размер текста (стандарт 16px)</div>' +
                '</div>');

                // Генерируем все размеры от 8 до 32
                var fontSizes = [];
                for(var i = 8; i <= 32; i++) {
                    var label = i <= 16 ? 'Маленький (' + i + 'px)' : 
                               i <= 20 ? 'Средний (' + i + 'px)' :
                               i <= 24 ? 'Крупный (' + i + 'px)' : 'Очень крупный (' + i + 'px)';
                    fontSizes.push({title: label, value: i});
                }

                item.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Размер шрифта',
                        items: fontSizes,
                        onSelect: function (a) {
                            Lampa.Storage.set('font_size_value', a.value);
                            Lampa.Storage.set('font_size_model', 'custom');
                            applySize(a.value);
                            Lampa.Settings.update();
                        }
                    });
                });

                // Добавляем выбор модели шрифта
                var modelItem = $('<div class="settings-param selector font-size-selector" data-name="font_size_model">' +
                    '<div class="settings-param__name">Модель шрифта</div>' +
                    '<div class="settings-param__value">Стандартная</div>' +
                    '<div class="settings-param__descr">Выберите стиль шрифта</div>' +
                '</div>');

                modelItem.on('hover:enter', function () {
                    var currentModel = Lampa.Storage.get('font_size_model', 'standard');
                    Lampa.Select.show({
                        title: 'Модель шрифта',
                        items: [
                            {title: 'Стандартная', value: 'standard'},
                            {title: 'Компактная', value: 'compact'},
                            {title: 'Широкая', value: 'wide'},
                            {title: 'Моноширинная', value: 'monospace'}
                        ],
                        onSelect: function (a) {
                            Lampa.Storage.set('font_size_model', a.value);
                            applySize();
                            Lampa.Settings.update();
                        }
                    });
                });

                e.body.find('[data-name="interface_size"]').after(item).after(modelItem);
            }
        });

        function applySize(size) {
            var val = size || Lampa.Storage.get('font_size_value', '16');
            var model = Lampa.Storage.get('font_size_model', 'standard');
            
            var style = $('#plugin-font-size-style');
            if (!style.length) {
                style = $('<style id="plugin-font-size-style"></style>').appendTo('head');
            }

            var fontFamily = model == 'compact' ? 'Arial Narrow, sans-serif' :
                           model == 'wide' ? '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' :
                           model == 'monospace' ? '"Courier New", Consolas, monospace' :
                           'system-ui, -apple-system, sans-serif';
            
            style.text(`
                html, body { 
                    font-size: ${val}px !important;
                    font-family: ${fontFamily} !important;
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
