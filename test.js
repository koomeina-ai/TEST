(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта',
        version: '1.2.0',
        description: 'Позволяет изменять размер и шрифт интерфейса'
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
                            applySize(a.value);
                            Lampa.Settings.update();
                        }
                    });
                });

                // Добавляем выбор шрифта
                var fontItem = $('<div class="settings-param selector font-size-selector" data-name="font_family">' +
                    '<div class="settings-param__name">Шрифт</div>' +
                    '<div class="settings-param__value">Arial</div>' +
                    '<div class="settings-param__descr">Выберите шрифт интерфейса</div>' +
                '</div>');

                fontItem.on('hover:enter', function () {
                    var currentFont = Lampa.Storage.get('font_family', 'Arial');
                    Lampa.Select.show({
                        title: 'Выбор шрифта',
                        items: [
                            {title: 'Arial', value: 'Arial, sans-serif'},
                            {title: 'Helvetica', value: '"Helvetica Neue", Helvetica, Arial, sans-serif'},
                            {title: 'Times New Roman', value: '"Times New Roman", Times, serif'},
                            {title: 'Georgia', value: 'Georgia, serif'},
                            {title: 'Verdana', value: 'Verdana, Geneva, sans-serif'},
                            {title: 'Tahoma', value: 'Tahoma, Geneva, sans-serif'},
                            {title: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif'},
                            {title: 'Impact', value: 'Impact, Haettenschweiler, sans-serif'},
                            {title: 'Courier New', value: '"Courier New", Courier, monospace'},
                            {title: 'Lucida Console', value: '"Lucida Console", Monaco, monospace'},
                            {title: 'Segoe UI', value: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'},
                            {title: 'Roboto', value: 'Roboto, "Helvetica Neue", sans-serif'}
                        ],
                        onSelect: function (a) {
                            Lampa.Storage.set('font_family', a.value);
                            updateFontValueDisplay();
                            applySize();
                            Lampa.Settings.update();
                        }
                    });
                });

                e.body.find('[data-name="interface_size"]').after(item).after(fontItem);
                
                // Обновляем отображение текущего шрифта
                updateFontValueDisplay();
            }
        });

        function updateFontValueDisplay() {
            var fontFamily = Lampa.Storage.get('font_family', 'Arial, sans-serif');
            var fontNames = fontFamily.split(',')[0].replace(/"/g, '');
            $('.settings-param[data-name="font_family"] .settings-param__value').text(fontNames);
        }

        function applySize(size) {
            var val = size || Lampa.Storage.get('font_size_value', '16');
            var fontFamily = Lampa.Storage.get('font_family', 'Arial, sans-serif');
            
            var style = $('#plugin-font-size-style');
            if (!style.length) {
                style = $('<style id="plugin-font-size-style"></style>').appendTo('head');
            }

            style.text(`
                html, body, .selector, .settings-param { 
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
