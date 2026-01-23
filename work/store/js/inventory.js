function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div>錢：${player.gold} 元</div>
        <div>背包空間：${getCurrentInventorySize()}/${maxInventorySize}</div>
        <div id="item-container"></div>`

    inv.forEach((invItem, index) => {
        let temp = ''
        if (getItem(invItem.itemId).category == 'item') {
            temp = `
                <div class="inv-item">
                    <div class="inv-item-name inv-item-bacground">${getItem(invItem.itemId).name}</div>
                    <div class="inv-item-amount">${invItem.amount}</div>
                    <div class="inv-item-button"><button type="button" onclick=useItem('${index}')>使用</button></div>
                </div>`
        }
        else if (getItem(invItem.itemId).category == 'armor') {
            temp = `
                <div class="inv-item">
                    <div class="inv-item-name inv-armor-bacground">${getItem(invItem.itemId).name}</div>
                    <div class="inv-item-amount">${invItem.amount}</div>
                    <div class="inv-item-button"><button type="button" onclick=equipItem('${index}')>裝備</button></div>
                </div>`
        }

        document.querySelector('#item-container').innerHTML += temp
    });
}

function useItem(index) {
    const inv = getPlayer(getCurrentPlayerId()).inv
    const invItem = inv[index]
    invItem.amount -= 1
    if (invItem.amount <= 0) {
        removeInv(index)
    }
    updateInventory()
}

function equipItem(itemId) {
    console.log('裝備' + itemId)
}

function getCurrentInventorySize() {
    return getPlayer(getCurrentPlayerId()).inv.length
}

//  [ 'index': invIndex, 'item': invItem]
function pickOneCategory(category) {
    const a = []
    const inv = getPlayer(getCurrentPlayerId()).inv
    for (let i = 0; i < inv.length; i++) {
        if (getItem(inv[i].itemId).category == category) {
            a[a.length] = { 'index': i, 'item': inv[i] }
        }
    }

    return a
}

function pick(index) {
    return getPlayer(getCurrentPlayerId()).inv[index]
}

function pickByItemId(itemId) {
    const a = []
    const inv = getPlayer(getCurrentPlayerId()).inv
    for (let i = 0; i < inv.length; i++) {
        if (inv[i].itemId == itemId) {
            a[a.length] = inv[i]
        }
    }

    return a
}

function addInv(itemId, amount) {
    const inv = getPlayer(getCurrentPlayerId()).inv
    inv[inv.length] = { 'itemId': itemId, 'amount': amount }
}

function removeInv(index) {
    getPlayer(getCurrentPlayerId()).inv.splice(index, 1)
}