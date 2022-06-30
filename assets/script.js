(function () {
    init();

    async function init() {

        if (!verifyPageLoaded()) {
            setTimeout(init, 500);
            return;
        }
                
        await addExitHour();
    }

    function registerEvents() {
        let btnPonto = document.querySelectorAll('pm-button.btn-register');
        let btnReload = document.querySelectorAll('pm-button.btn-reload');

        btnPonto.forEach(el => el.removeEventListener('click', reloadExitHour));
        btnReload.forEach(el => el.removeEventListener('click', reloadExitHour));

        btnPonto.forEach(el => el.addEventListener('click', reloadExitHour));
        btnReload.forEach(el => el.addEventListener('click', reloadExitHour));
    }


    function reloadExitHour() {
        document.querySelectorAll('.bx-horario-saida').forEach(el => el.remove());
        
        setTimeout(addExitHour, 700);
    }

    async function addExitHour() {
        let hour = await calcTime();

        let el = generateElement(hour);

        $('div.dx-toolbar-after').prepend(el);

        registerEvents();
    }

    function verifyPageLoaded()
    {
        let elementQuery = 'pm-button.btn-registrar';        
        return document.querySelector(elementQuery) != undefined;
    }

    async function calcTime() {
        minutosDia = 8 * 60;

        if (!verifyPageLoaded())
            return 'not_loaded';

        let timeCards = await getTimeCards();

        if (timeCards.length % 2 === 0) {        
            return '--:--';
        }

        secondList = timeCards.map(ponto => toSeconds(ponto.time));

        diffSeconds = 0;
        for (x = 0; x < secondList.length - 1; x += 2) {
            diffSeconds += secondList[x + 1] - secondList[x];
        }

        saida = minutosDia - diffSeconds + secondList[secondList.length - 1];

        return toFormatted(saida);

        function toSeconds(str) {
            let splited = str.split(':');
            return splited[0] * 60 + Number(splited[1]);
        }

        function toFormatted(n) {
            h = parseInt(n / 60);
            if (h > 24) h -= 24;
            m = n % 60;
            return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
        }
    }

    async function getTimeCards()
    {        
        let today = new Date().toLocaleDateString('en-CA');

        var resp = await fetch(`https://api.pontomais.com.br/api/time_card_control/current/work_days/${today}`, {
            method: 'GET',
            headers: createHeaders()
        }).then(r => r.json());

        return resp.work_day == null ? [] : resp.work_day.time_cards;
    }

    function createHeaders()
    {
        let strToken = localStorage.getItem("token");
        if (strToken == undefined || strToken.length == 0)
            return null;

        let token = JSON.parse(strToken);

        let headers = new Headers();
        headers.append('access-token', token.token);
        headers.append('api-version', 2);
        headers.append('client', token.client_id);
        headers.append('token', token.token);
        headers.append('uid', token.uid);
        headers.append('uuid', token.uuid);

        return headers;
    }

    function generateElement(hour) {
        return `<div class="dx-item dx-toolbar-item dx-toolbar-button bx-horario-saida">
                    <dxi-item class="dx-template-wrapper dx-item-content dx-toolbar-item-content">
                        <div class="d-flex">
                            <pm-button name="pm-white" class="horario-saida">
                                <span _ngcontent-mjr-c7="" class="pm-button-content ng-star-inserted"> Você pode sair a partir das ${hour}</span>
                            </pm-button>
                            <pm-button class="btn-reload horario-saida" title="Atualizar" alt="Atualizar">
                                <i _ngcontent-cah-c7="" class="pm-icon-return-outline p-1 p-0 ng-star-inserted"></i>
                            </pm-button
                        </div>
                    </dxi-item>
                </div>`;
    }

})();