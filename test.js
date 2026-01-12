(function () {
    'use strict';

    if (!window.Lampa) return;

    const STORAGE_KEY = 'lampa_backup_webdav';

    const Plugin = {
        name: 'LAMPA Backup',
        version: '2.0',

        getData() {
            let data = {
                app_version: Lampa.Manifest.version,
                created: new Date().toISOString(),
                settings: {},
                plugins: []
            };

            // localStorage
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                data.settings[key] = localStorage.getItem(key);
            }

            // plugins
            Lampa.Plugins.get().forEach(p => {
                if (p.url) {
                    data.plugins.push({
                        name: p.name,
                        url: p.url
                    });
                }
            });

            return data;
        },

        restore(data) {
            Object.keys(data.settings || {}).forEach(k => {
                localStorage.setItem(k, data.settings[k]);
            });

            (data.plugins || []).forEach(p => {
                Lampa.Plugins.add({
                    name: p.name,
                    url: p.url
                });
            });

            Lampa.Noty.show('Готово! Перезапуск…');
            setTimeout(() => location.reload(), 2000);
        },

        exportLocal() {
            let blob = new Blob(
                [JSON.stringify(this.getData(), null, 2)],
                { type: 'application/json' }
            );

            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'lampa_backup.json';
            a.click();
        },

        importLocal() {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            input.onchange = () => {
                let reader = new FileReader();
                reader.onload = e => {
                    this.restore(JSON.parse(e.target.result));
                };
                reader.readAsText(input.files[0]);
            };

            input.click();
        },

        saveWebDAV() {
            let cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (!cfg.url) return Lampa.Noty.show('WebDAV не настроен');

            fetch(cfg.url, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + btoa(cfg.user + ':' + cfg.pass),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.getData())
            }).then(() => {
                Lampa.Noty.show('Бэкап загружен в облако');
            });
        },

        loadWebDAV() {
            let cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (!cfg.url) return Lampa.Noty.show('WebDAV не настроен');

            fetch(cfg.url, {
                headers: {
                    'Authorization': 'Basic ' + btoa(cfg.user + ':' + cfg.pass)
                }
            })
                .then(r => r.json())
                .then(data => this.restore(data));
        },

        setupWebDAV() {
            let cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

            Lampa.Input.show({
                title: 'WebDAV URL',
                value: cfg.url || '',
                callback: url => {
                    cfg.url = url;

                    Lampa.Input.show({
                        title: 'Логин',
                        value: cfg.user || '',
                        callback: user => {
                            cfg.user = user;

                            Lampa.Input.show({
                                title: 'Пароль',
                                value: cfg.pass || '',
                                callback: pass => {
                                    cfg.pass = pass;
                                    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
                                    Lampa.Noty.show('WebDAV сохранён');
                                }
                            });
                        }
                    });
                }
            });
        },

        open() {
            Lampa.Select.show({
                title: 'LAMPA Backup',
                items: [
                    { title: '📤 Экспорт (файл)', callback: () => this.exportLocal() },
                    { title: '📥 Импорт (файл)', callback: () => this.importLocal() },
                    { title: '☁ Бэкап в WebDAV', callback: () => this.saveWebDAV() },
                    { title: '☁ Восстановить из WebDAV', callback: () => this.loadWebDAV() },
                    { title: '⚙ Настроить WebDAV', callback: () => this.setupWebDAV() }
                ]
            });
        }
    };

    Lampa.Settings.add({
        title: 'LAMPA Backup',
        description: 'Бэкап и перенос настроек',
        onSelect: () => Plugin.open()
    });

})();
