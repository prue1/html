function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div>錢：${player.gold} 元</div>
        <div>背包空間：${getCurrentInventorySize()}/${maxInventorySize}</div>`

    inv.forEach((invItem, index) => {
        let temp = ''
        if (getItem(invItem.itemId).category == 'item') {
            temp = `
                <div>${getItem(invItem.itemId).name}:${invItem.amount}<button type="button" onclick=useItem('${index}')>使用</button></div>`
        }
        else if (getItem(invItem.itemId).category == 'armor') {
            temp = `
                <div>${getItem(invItem.itemId).name}:${invItem.amount}<button type="button" onclick=equipItem('${index}')>裝備</button></div>`
        }

        document.querySelector('#inventory-container').innerHTML += temp
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
    return Object.keys(getPlayer(getCurrentPlayerId()).inv).length
}

//  Object.keys(jsonObj) => [ [key, value], [key, value], [key, value], ...]
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
    const inv = getPlayer(getCurrentPlayerId()).inv
    for (let i = 0; i < inv.length; i++) {
        if (inv[i].itemId == itemId) {
            return inv[i]
        }
    }
}

function addInv(itemId, amount) {
    const inv = getPlayer(getCurrentPlayerId()).inv
    inv[inv.length] = { 'itemId': itemId, 'amount': amount }
}

function removeInv(index) {
    getPlayer(getCurrentPlayerId()).inv.splice(index, 1)
}