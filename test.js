(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта',
        version: '1.5.2',
        description: 'Шрифты с эмодзи + только читаемые'
    };

    function start() {
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var item = $('<div class="settings-param selector font-size-selector" data-name="font_size_value">' +
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
                            Lampa.Storage.set('font_size_value', '' + a.value);
                            updateDisplays();
                            applyFont();
                            Lampa.Settings.update();
                        }
                    });
                });

                var fontItem = $('<div class="settings-param selector font-size-selector" data-name="font_family">' +
                    '<div class="settings-param__name">Шрифт</div>' +
                    '<div class="settings-param__value">Arial</div>' +
                    '<div class="settings-param__descr">Стильные шрифты с иконками ✨</div>' +
                '</div>');

                fontItem.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: '🎨 Шрифты с эмодзи',
                        items: [
                            // ✅ КЛАССИКА
                            {title: '📝 Arial', value: 'Arial, sans-serif'},
                            {title: '📖 Verdana', value: 'Verdana, Geneva, sans-serif'},
                            {title: '💬 Tahoma', value: 'Tahoma, Geneva, sans-serif'},
                            {title: '🖥️ Segoe UI', value: '"Segoe UI", Tahoma, Geneva, sans-serif'},
                            {title: '📚 Times', value: '"Times New Roman", Times, serif'},
                            {title: '✍️ Georgia', value: 'Georgia, serif'},
                            {title: '🎯 Trebuchet', value: '"Trebuchet MS", Helvetica, sans-serif'},
                            {title: '🔥 Impact', value: 'Impact, Haettenschweiler, sans-serif'},
                            {title: '💻 Courier', value: '"Courier New", Courier, monospace'},
                            {title: '⚙️ Consolas', value: 'Consolas, "Lucida Console", monospace'},
                            
                            // ✅ НЕОБЫЧНЫЕ
                            {title: '😂 Comic Sans', value: '"Comic Sans MS", cursive, sans-serif'},
                            {title: '💎 Papyrus', value: 'Papyrus, fantasy, cursive'},
                            {title: '🖌️ Brush Script', value: '"Brush Script MT", cursive'},
                            {title: '✋ Lucida Hand', value: '"Lucida Handwriting", cursive'},
                            {title: '💫 Segoe Script', value: '"Segoe Script", cursive'},
                            {title: '👶 Segoe Print', value: '"Segoe Print", cursive'},
                            
                            // ✅ КОДЕРСКИЕ
                            {title: '🔧 Fira Code', value: '"Fira Code", Consolas, monospace'},
                            {title: '🐛 JetBrains Mono', value: '"JetBrains Mono", Consolas, monospace'},
                            
                            // ✅ РЕТРО
                            {title: '🇯🇵 MS Gothic', value: '"MS Gothic", monospace'}
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
                updateDisplays();
            }
        });

        function updateDisplays() {
            var size = Lampa.Storage.get('font_size_value', '16');
            var family = Lampa.Storage.get('font_family', 'Arial, sans-serif');
            
            var sizeEl = $('.settings-param[data-name="font_size_value"] .settings-param__value');
            var fontEl = $('.settings-param[data-name="font_family"] .settings-param__value');
            
            if (sizeEl.length) sizeEl.text(size + 'px');
            if (fontEl.length) fontEl.text(family.split(',')[0].replace(/"/g, ''));
        }

        function applyFont() {
            var size = Lampa.Storage.get('font_size_value', '16');
            var family = Lampa.Storage.get('font_family', 'Arial, sans-serif');
            
            $('#plugin-font-size-style, #font-override-all').remove();
            
            $('<style id="font-override-all">').text(`
                * {
                    font-family: ${family} !important;
                    font-size: ${size}px !important;
                    line-height: 1.2 !important;
                }
                .selector, .settings-param, .view--title, .item__name {
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
        }

        setTimeout(applyFont, 500);
        setTimeout(applyFont, 1500);
        setTimeout(applyFont, 3000);
        setTimeout(updateDisplays, 100);
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
