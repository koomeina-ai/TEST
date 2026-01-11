(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта',
        version: '1.4.1',
        description: 'Отображение активных значений размера и шрифта'
    };

    function start() {
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var item = $('<div class="settings-param selector font-size-selector" data-type="range" data-name="font_size_value">' +
                    '<div class="settings-param__name">Размер шрифта</div>' +
                    '<div class="settings-param__value">16px</div>' +
                    '<div class="settings-param__descr">8-32px</div>' +
                '</div>');

                var fontSizes = [];
                for(var i = 8; i <= 32; i++) {
                    fontSizes.push({title: i + 'px', value: i});
                }

                item.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Размер шрифта',
                        items: fontSizes,
                        onSelect: function (a) {
                            Lampa.Storage.set('font_size_value', a.value);
                            updateDisplays();
                            applyFont();
                            Lampa.Settings.update();
                        }
                    });
                });

                var fontItem = $('<div class="settings-param selector font-size-selector" data-name="font_family">' +
                    '<div class="settings-param__name">Шрифт</div>' +
                    '<div class="settings-param__value">Arial</div>' +
                    '<div class="settings-param__descr">Выберите шрифт</div>' +
                '</div>');

                fontItem.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Шрифты (прокрутите)',
                        items: [
                            {title: 'Arial', value: 'Arial, sans-serif'},
                            {title: 'Verdana', value: 'Verdana, Geneva, sans-serif'},
                            {title: 'Tahoma', value: 'Tahoma, Geneva, sans-serif'},
                            {title: 'Times', value: '"Times New Roman", serif'},
                            {title: 'Georgia', value: 'Georgia, serif'},
                            {title: 'Courier', value: '"Courier New", monospace'},
                            {title: 'Segoe UI', value: '"Segoe UI", sans-serif'},
                            {title: 'Trebuchet', value: '"Trebuchet MS", sans-serif'},
                            {title: 'Impact', value: 'Impact, sans-serif'}
                        ],
                        onSelect: function (a) {
                            Lampa.Storage.set('font_family', a.value);
                            updateDisplays();
                            applyFont();
                            Lampa.Settings.update();
                        }
                    });
                });

                e.body.find('[data-name="interface_size"]').after(item).after(fontItem);
                
                // ✅ ИНИЦИАЛИЗИРУЕМ ПОКАЗАНИЕ АКТИВНЫХ ЗНАЧЕНИЙ
                updateDisplays();
            }
        });

        function updateDisplays() {
            var size = Lampa.Storage.get('font_size_value', '16');
            var family = Lampa.Storage.get('font_family', 'Arial, sans-serif');
            
            // ✅ ПОКАЗЫВАЕМ АКТИВНЫЙ РАЗМЕР ШРИФТА
            $('.settings-param[data-name="font_size_value"] .settings-param__value').text(size + 'px');
            
            // ✅ ПОКАЗЫВАЕМ АКТИВНЫЙ ШРИФТ
            $('.settings-param[data-name="font_family"] .settings-param__value').text(family.split(',')[0].replace(/"/g, ''));
        }

        function applyFont() {
            var size = Lampa.Storage.get('font_size_value', '16');
            var family = Lampa.Storage.get('font_family', 'Arial, sans-serif');
            
            $('#plugin-font-size-style, #font-override-all').remove();
            
            $('<style id="font-override-all">').text(`
                *:not(.native-font *) {
                    font-family: ${family} !important;
                    font-size: ${size}px !important;
                    line-height: 1.2 !important;
                }
                html, body {
                    font-family: ${family} !important;
                    font-size: ${size}px !important;
                }
                .selector, .settings-param, .view--title, .files__title,
                .item__name, .info__title, .category-full__title {
                    font-family: ${family} !important;
                    font-size: ${size}px !important;
                }
                .font-size-selector.focus, .font-size-selector.hover {
                    box-shadow: 0 0 0 3px #00ff00 !important;
                    border-radius: 6px !important;
                }
                .font-size-selector.focus .settings-param__name,
                .font-size-selector.hover .settings-param__name {
                    color: #ffffff !important;
                }
            `).appendTo('head');

            if(Lampa.Activity.active()) {
                Lampa.Activity.active().render();
            }
        }

        // Применяем при загрузке и обновляем отображение
        setTimeout(function() {
            applyFont();
            updateDisplays();
        }, 1000);
        setTimeout(function() {
            applyFont();
            updateDisplays();
        }, 3000);
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
