const API = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=';

function getLocalStorage(key) {
    return window.localStorage.getItem(key) == null
        ? [] : JSON.parse(window.localStorage.getItem(key));
}

class Mask {

    constructor() {
        this.searchParams = [];
        this.pharms = [];
    }

    search() {
        const handleData = this.handleData.bind(this);
        this.searchParams = [
            '경기도 안산시 단원구 초지동',
            '경기도 안산시 단원구 원곡동',
            '경기도 군포시 산본동',
            '경상북도 경주시 동천동',
            '경상북도 경주시 용강동'
        ];
        this.pharms = [
            {
                addr: '경기도 군포시 산본동',
                name: '성보약국'
            },
            {
                addr: '경기도 군포시 산본동',
                name: '제일건강한약국'
            },
            {
                addr: '경기도 군포시 산본동',
                name: '금정약국'
            },
        ];

        $('#main').empty();
    
        this.searchParams.forEach((addr, index) => handleData(addr, index))
    }

    async handleData(addr, index) {
        const data = await this.fetchPharm(addr);
        this.render(addr, data.stores, index);
    }

    async fetchPharm(addr) {
        const res = await fetch(API + addr);
        return await res.json();
    }

    render(addr, stores, index) {
        const template = `
            <div>
                <h3
                    data-toggle="collapse"
                    data-target="#stores-${index}"
                    aria-expanded="false"
                    aria-controls="stores-${index}"
                >${addr}</h3>
                <div id="stores-${index}" class="collapse">
                ${this.renderStores(addr, stores)}
                </div>
            </div>
        `;
        $('#main').append(template);
    }

    renderStores(addr, stores) {
        const storeTemplate = this.storeTemplate.bind(this);
        const filterPharm = this.filterPharm.bind(this);

        if(stores.length === 0) {
            return '<div class="card"><div class="card-body">약국을 찾을 수 없습니다.</div></div>';
        }

        return stores.filter(store => filterPharm(addr, store.name))
            .map(storeTemplate).join('');
    }

    storeTemplate(store) {
        const checRemain = this.checRemain.bind(this);
        return `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${store.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${checRemain(store.remain_stat)} (${store.created_at})</h6>
                <p class="card-text">최근 입고 ${store.stock_at}</p>
                <p class="card-text">${store.addr}</p>
            </div>
        </div>`;
    }

    checRemain(remain) {
        if(remain == null) {
            return '알수없음';
        }
        switch(remain) {
            case 'some':
                return '있음';
            case 'few':
                return '적음';
            case 'empty':
                return '없음';
            default:
                return '많음';
        }
    }

    filterPharm(addr, pharmName) {
        return this.pharms.length === 0
            || this.pharms.findIndex(p => p.addr === addr) < 0
            || this.pharms.findIndex(pharm => pharm.name === pharmName) >= 0;
    }
}
