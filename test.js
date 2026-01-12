(function () {
    'use strict';

    if (!window.Lampa) return;

    let popup;

    function createPopup() {
        popup = document.createElement('div');
        popup.id = 'movie_hint_popup';

        popup.style.cssText = `
            position: fixed;
            left: 50%;
            bottom: 8%;
            transform: translateX(-50%);
            max-width: 70%;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 16px 20px;
            border-radius: 12px;
            z-index: 99999;
            font-size: 15px;
            line-height: 1.4;
            display: none;
            box-shadow: 0 10px 30px rgba(0,0,0,.6);
        `;

        document.body.appendChild(popup);
    }

    function show(card) {
        if (!popup) createPopup();
        if (!card || !card.data) return;

        const d = card.data;

        const title = d.title || d.name || 'Без названия';
        const year = d.release_date ? d.release_date.slice(0, 4) : '';
        const genres = (d.genres || []).map(g => g.name).join(', ');
        const overview = d.overview || 'Описание отсутствует';

        popup.innerHTML = `
            <div style="font-size:18px;font-weight:600;margin-bottom:6px">
                ${title} ${year ? `(${year})` : ''}
            </div>
            <div style="opacity:.7;margin-bottom:8px">
                ${genres}
            </div>
            <div>
                ${overview}
            </div>
        `;

        popup.style.display = 'block';
    }

    function hide() {
        if (popup) popup.style.display = 'none';
    }

    // отслеживаем фокус карточек
    Lampa.Listener.follow('card', function (event) {
        if (event.type === 'hover' || event.type === 'focus') {
            show(event.card);
        }

        if (event.type === 'out' || event.type === 'blur') {
            hide();
        }
    });

})();
