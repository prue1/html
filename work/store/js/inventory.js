function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div>錢：${player.gold} 元</div>
        <div>背包空間(最大：${maxInventorySize})：</div>
        <div>已使用：${getCurrentInventorySize()}，剩餘：${maxInventorySize - getCurrentInventorySize()}</div>
        <div id="item-container"></div>`

    inv.forEach((invItem, index) => {
        let temp = ''
        if (getItem(invItem.itemId).category == 'item') {
            temp = `
                <div class="inv-item inv-item-bacground"
                        draggable="true"
                        ondragstart="dragstartHandler(event, ${index})"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropHandler(event, ${index})">
                    <div class="inv-item-name">
                        <span>${getItem(invItem.itemId).name}</span>
                        <span class="noteworthy">${invItem.amount}</span>
                    </div>
                    <div class="inv-item-button">
                        <button type="button" onclick=useItem('${index}')>使用</button>
                    </div>
                </div>`
        }
        else if (getItem(invItem.itemId).category == 'armor') {
            temp = `
                <div class="inv-item inv-armor-bacground"
                        draggable="true"
                        ondragstart="dragstartHandler(event, ${index})"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropHandler(event, ${index})" >
                    <div class="inv-item-name">
                        <span>${getItem(invItem.itemId).name}</span>
                        <span class="noteworthy">${invItem.amount}</span>
                    </div>
                    <div class="inv-item-button">
                        <button type="button" onclick=equipItem('${index}')>裝備</button>
                    </div>
                </div>`
        }

        document.querySelector('#item-container').innerHTML += temp
    });

    const empty = maxInventorySize - inv.length
    for (let i = 0; i < empty; i++) {
        temp = `
                <div class="inv-empty"></div>`

        document.querySelector('#item-container').innerHTML += temp
    }
}

function dragstartHandler(ev, fromIndex) {
    ev.dataTransfer.setData("fromIndex", fromIndex);
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev, toIndex) {
    ev.preventDefault();
    const fromIndex = ev.dataTransfer.getData("fromIndex");
    if (fromIndex != toIndex) {
        const inv = getPlayer(getCurrentPlayerId()).inv
        const temp = inv[toIndex]
        inv[toIndex] = inv[fromIndex]
        inv[fromIndex] = temp
        updateInventory()
    }
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