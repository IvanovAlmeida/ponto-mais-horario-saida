(function () {
    if (window.location.href !== 'https://app2.pontomais.com.br/meu-ponto') {
        return;
    }

    loop();

    async function loop() {
        value = await calcTime();
        if (value === 'not_loaded') {
            setTimeout(loop, 500);
            return;
        }
        adjustLayout(value);
    }

    function adjustLayout(hour) {
        el = generateElement(hour);
        $(el).insertAfter('pm-card div.title');
    }
    
    function generateElement(hour) {
        return `<div class="row" style="padding-left: 7px;margin-bottom: 7px;">
                    <div class="card card-content">
                        <div class="container" style="padding: 0; border-radius: 3px;">
                            <div class="" style="background-image: linear-gradient(-90deg, #358d8e, #7bc79c);border:0;color: #FFF;padding: 5px; border-radius: 3px;">
                                <div style="font-size: 12pt;">
                                    Você pode sair a partir das <span style="font-weight: bold;">${hour}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    function verifyPageLoaded()
    {
        let elementQuery = 'pm-card[titlecard="Meu ponto"]';        
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
        let today = new Date().toISOString().split('T')[0];

        var resp = await fetch(`https://api.pontomais.com.br/api/time_card_control/current/work_days/${today}`, {
            method: 'GET',
            headers: createHeaders()
        }).then(r => r.json());

        return resp.work_day.time_cards;
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
})();