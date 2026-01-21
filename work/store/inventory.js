function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div>錢：${player.gold} 元</div>
        <div>背包空間：${getCurrentInventorySize()}/${maxInventorySize}</div>`

    inv.forEach((element) => {
        let temp = ''
        if (getItem(element.itemId).category == 'item') {
            temp = `
                <div>${getItem(element.itemId).name}:${element.amount}<button type="button" onclick=useItem('${element.itemId}')>使用</button></div>`
        }
        else if (getItem(element.itemId).category == 'armor') {
            temp = `
                <div>${getItem(element.itemId).name}:${element.amount}<button type="button" onclick=equipItem('${element.itemId}')>裝備</button></div>`
        }

        document.querySelector('#inventory-container').innerHTML += temp
    });
}

function getCurrentInventorySize() {
    return Object.keys(getPlayer(getCurrentPlayerId()).inv).length
}

//  Object.keys(jsonObj) => [ [key, value], [key, value], [key, value], ...]
function pickOneCategory(category) {
    const a = []
    console.log(getPlayer(getCurrentPlayerId()).inv)
    getPlayer(getCurrentPlayerId()).inv.forEach((element) => {
        if (getItem(element.itemId).category == category) {
            a[a.length] = element
        }
    })

    return a
}

function pick(index) {
    return getPlayer().inv[index]
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

function removeInv(itemId) {
    const inv = getPlayer(getCurrentPlayerId()).inv
    for (let i = 0; i < inv.length; i++) {
        if (inv[i].itemId == itemId) {
            inv.splice(i, 1)
            break
        }
    }
}