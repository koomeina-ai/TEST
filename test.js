(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта Max',
        version: '1.1.0',
        description: 'Изменение размера текста от 8 до 36px'
    };

    function start() {
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var current = Lampa.Storage.get('font_size_value', '16');
                var item = $('<div class="settings-param selector" data-name="font_size_value">' +
                    '<div class="settings-param__name">Размер шрифта</div>' +
                    '<div class="settings-param__value">' + current + 'px</div>' +
                    '<div class="settings-param__descr">Выберите размер текста (от 8 до 36px)</div>' +
                '</div>');

                item.on('hover:enter', function () {
                    var items = [];
                    // Генерируем список от 8 до 36
                    for (var i = 8; i <= 36; i++) {
                        items.push({
                            title: i + 'px',
                            value: i
                        });
                    }

                    Lampa.Select.show({
                        title: 'Размер шрифта',
                        items: items,
                        onSelect: function (a) {
                            Lampa.Storage.set('font_size_value', a.value);
                            applySize(a.value);
                            item.find('.settings-param__value').text(a.value + 'px');
                        }
                    });
                });

                e.body.find('[data-name="interface_size"]').after(item);
            }
        });

        function applySize(size) {
            var val = size || Lampa.Storage.get('font_size_value', '16');
            var style = $('#plugin-font-size-style');
            if (!style.length) {
                style = $('<style id="plugin-font-size-style"></style>').appendTo('head');
            }
            // Применяем ко всему интерфейсу через root и body
            style.text('html, body { font-size: ' + val + 'px !important; }');
        }

        applySize();
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
