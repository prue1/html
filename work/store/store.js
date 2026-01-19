const items = {
    'i01': { category: 'item', name: '藥草', price: 3 },
    'i02': { category: 'item', name: '金創藥', price: 5 },
    'i03': { category: 'item', name: '小還丹', price: 10 },
    'i04': { category: 'item', name: '大還丹', price: 15 },
    'i05': { category: 'item', name: '解毒丹', price: 5 },
    'i06': { category: 'item', name: '小復活丹', price: 10 },
    'i07': { category: 'item', name: '大復活丹', price: 20 },
    'i08': { category: 'item', name: '行氣散', price: 12 },
    'i09': { category: 'item', name: '加速丹', price: 13 },
    'i10': { category: 'item', name: '防禦丹', price: 17 },
    'i11': { category: 'item', name: '辟邪丹', price: 20 },
}

const store = {
    'store1': { name: '很有效藥店', storeItems: ['i01', 'i02', 'i03'] },
    'store2': { name: '大補藥店', storeItems: ['i02', 'i03', 'i04', 'i05', 'i06'] },
    'store3': { name: '萬全藥莊', storeItems: ['i01', 'i02', 'i03', 'i04', 'i05', 'i06', 'i07', 'i08', 'i09', 'i10', 'i11'] }
}

const player = {
    'player1': { name: '海賊王', gold: 100, inv: {}, location: 'store1' },
    'player2': { name: '飛天小女警', gold: 100, inv: {}, location: 'store1' },
    'player3': { name: '海棉寶寶', gold: 100, inv: {}, location: 'store1' },
    'player4': { name: '風之谷', gold: 100, inv: {}, location: 'store2' },
    'player5': { name: '科學小飛俠', gold: 100, inv: {}, location: 'store2' },
    'player6': { name: '秀逗魔導士', gold: 100, inv: {}, location: 'store3' }
}

const maxInventory = 32
const maxPile = 99
const currentPlayer = { player: 'player6' }

function setup() {
    setupPlayer()
    setupStore()
}

function setScene() {
    console.log('set scene.')

    const temp = `
        <div class="buy-menu">
            <div id="item-list"></div>
            <div class="mask"></div>
            <div id="buy-panel">
                <div id="buy-panel-1">
                    <input type="hidden" id="itemId-value">
                    <div class="item-name-value">名稱：<span class="name-value noteworthy"></span></div>
                    <div class="item-price-value">售價：<span class="price-value noteworthy"></span>元</div>
                    <div>
                        <label for="amount">數量：</label><input type="text" class="noteworthy" id="amount" maxlength="2"
                            onclick="this.select()">
                    </div>
                    <div class="button-to-right">
                        <button type="button" class="buy-panel-button" onclick="confirmBuy()">確定</button>
                        <button type="button" class="buy-panel-button" onclick="cancelBuy()">取消</button>
                    </div>
                </div>
            </div>
        </div>`

    document.querySelector('#scene').innerHTML = temp
}

function setupPlayer() {
    document.querySelector('#sel-player').innerHTML = ''
    Object.entries(player).forEach(([key, value]) => {
        const temp = `
                <option value="${key}" ${key == currentPlayer.player ? 'selected' : ''}>${value.name}</option>`
        document.querySelector('#sel-player').innerHTML += temp
    });

    setPlayer(document.querySelector('#sel-player').value)
}

function setPlayer(playerId) {
    document.querySelector('#player-id').value = playerId
    updateInventory()
}

function getPlayer() {
    return player[document.querySelector('#player-id').value]
}

function setupStore() {
    document.querySelector('#sel-location').innerHTML = ''
    Object.entries(store).forEach(([key, value]) => {
        const temp = `
                <option value="${key}" ${getPlayer().location == key ? 'selected' : ''}>${value.name}</option>`
        document.querySelector('#sel-location').innerHTML += temp
    });

    setupStoreItem(document.querySelector('#sel-location').value)
}

function setupStoreItem(storeId) {
    setScene()
    document.querySelector('#item-list').innerHTML = ''
    store[storeId].storeItems.forEach(itemId => {
        const temp = `
                <div class="item">
                    <div class="item-name">${getItem(itemId).name}</div>
                    <div class="item-price">${getItem(itemId).price}</div>
                    <div><button type="button" class="item-buy-button" onclick="buy('${itemId}')">購買</div>
                </div>`
        document.querySelector('#item-list').innerHTML += temp
    })
}

function buy(itemId) {
    const item = getItem(itemId)
    document.querySelector('#buy-panel').style.display = 'block'
    document.querySelector('.mask').style.display = 'block'
    document.querySelector('#buy-panel-1 #itemId-value').value = itemId
    document.querySelector('#buy-panel-1 .name-value').innerHTML = item.name
    document.querySelector('#buy-panel-1 .price-value').innerHTML = item.price
    document.querySelector('#amount').value = 0
    document.querySelector('#amount').select()
    document.querySelector('#amount').focus()
    console.log('buy:')
    console.log(item)
}

function cancelBuy() {
    document.querySelector('#buy-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
}

function confirmBuy() {
    document.querySelector('#buy-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
    const itemId = document.querySelector('#buy-panel-1 #itemId-value').value
    const amount = parseInt(document.querySelector('#amount').value)
    if (amount > 0) {
        const inv = getPlayer().inv
        if (inv[itemId]) {
            inv[itemId].amount += amount
        }
        else {
            inv[itemId] = { 'amount': amount }
        }
        console.log('total:' + getItem(itemId).price * amount)
    }

    updateInventory()
    console.log(getPlayer().inv)
}

function useItem(itemId) {
    const inv = getPlayer().inv
    inv[itemId].amount -= 1
    if (inv[itemId].amount == 0) {
        delete inv[itemId]
    }
    updateInventory()
}

function updateInventory() {
    document.querySelector('#inventory-menu').innerHTML = ''
    const inv = getPlayer().inv
    document.querySelector('#inventory-menu').innerHTML += `<div>背包空間:${Object.keys(inv).length}/${maxInventory}</div>`
    Object.entries(inv).forEach(([itemId, value]) => {
        let temp = ''
        if (getItem(itemId).category == 'item') {
            temp = `
                <div>${getItem(itemId).name}:${value.amount}<button type="button" onclick=useItem('${itemId}')>使用</button></div>`
        }

        document.querySelector('#inventory-menu').innerHTML += temp
    });
}

function getItem(itemId) {
    return items[itemId]
}