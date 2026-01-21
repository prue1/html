function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div>錢：${player.gold} 元</div>
        <div>背包空間：${getCurrentInventorySize()}/${maxInventorySize}</div>`

    Object.entries(inv).forEach(([itemId, value]) => {
        let temp = ''
        if (getItem(itemId).category == 'item') {
            temp = `
                <div>${getItem(itemId).name}:${value.amount}<button type="button" onclick=useItem('${itemId}')>使用</button></div>`
        }
        else if (getItem(itemId).category == 'armor') {
            temp = `
                <div>${getItem(itemId).name}:${value.amount}<button type="button" onclick=equipItem('${itemId}')>裝備</button></div>`
        }

        document.querySelector('#inventory-container').innerHTML += temp
    });
}

function getCurrentInventorySize() {
    return Object.keys(getPlayer(getCurrentPlayerId()).inv).length
}

//  Object.keys(jsonObj) => [ [key, value], [key, value], [key, value], ...]
function getInventory(category) {
    const a = []
    Object.entries(getPlayer(getCurrentPlayerId()).inv).forEach(([itemId, value]) => {
        if (getItem(itemId).category == category) {
            a[a.length] = [itemId, value]
        }
    });

    return a
}