function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div class="inv-title">錢：${player.gold} 元</div>
        <div class="inv-title">背包空間(最大：${maxInventorySize})：</div>
        <div class="inv-title">已使用：${getCurrentInventorySize()}，剩餘：${maxInventorySize - getCurrentInventorySize()}</div>
        <div id="item-container"></div>`

    inv.forEach((invItem, index) => {
        let temp = ''
        if (getItem(invItem.itemId).category == 'item') {
            temp = `
                <div class="inv-item inv-item-bacground">
                    <div class="inv-insert-box"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropInsertHandler(event, ${index})">
                    </div>
                    <div class="inv-item-name inv-item-name-${index}"
                        draggable="true"
                        ondragstart="dragstartHandler(event, ${index})"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropHandler(event, ${index})"
                        ondragend="dragEndHandler(event)">
                        <span>${getItem(invItem.itemId).name}</span>
                        <span class="noteworthy">${invItem.amount}</span>
                    </div>
                    <button type="button" class="inv-item-button" onclick=useItem('${index}')>使用</button>
                </div>`
        }
        else if (getItem(invItem.itemId).category == 'armor') {
            temp = `
                <div class="inv-item inv-armor-bacground">
                    <div class="inv-insert-box"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropInsertHandler(event, ${index})">
                    </div>
                    <div class="inv-item-name inv-item-name-${index}"
                        draggable="true"
                        ondragstart="dragstartHandler(event, ${index})"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropHandler(event, ${index})"
                        ondragend="dragEndHandler(event)">
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

    for (let index = inv.length; index < maxInventorySize; index++) {
        temp = `
            <div class="inv-item inv-empty-bacground">
                <div class="inv-insert-box"
                    ondragover="dragoverHandler(event)"
                    ondrop="dropEmptyHandler(event)">
                </div>
                <div class="inv-empty"
                    ondragover="dragoverHandler(event)"
                    ondrop="dropEmptyHandler(event)">
                </div>
            </div>`

        document.querySelector('#item-container').innerHTML += temp
    }
}

function dragstartHandler(ev, fromIndex) {
    ev.dataTransfer.setData("fromIndex", fromIndex);
    const customDragImage = document.querySelector(`.inv-item-name-${fromIndex}`)
    // 取得計算後的元件設定
    //The getComputedStyle() method gets the computed CSS properties and values of an HTML element.
    //The getComputedStyle() method returns a CSSStyleDeclaration object.
    /*
    const computedStyle = window.getComputedStyle(customDragImage)
    ev.dataTransfer.setDragImage(
        customDragImage,
        parseInt(computedStyle.width),
        parseInt(computedStyle.height)
    );
    */

    document.querySelectorAll('.inv-insert-box').forEach((element) => {
        element.style['width'] = '20px'
    })
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev, toIndex) {
    ev.preventDefault();
    // 不斷修改、重試、修改、重試....執行一段時間後，發生無法取得 fromIndex 的問題，重開 Edge 後解決。
    const fromIndex = ev.dataTransfer.getData("fromIndex");
    if (fromIndex != toIndex) {
        const inv = getPlayer(getCurrentPlayerId()).inv
        const temp = inv[toIndex]
        inv[toIndex] = inv[fromIndex]
        inv[fromIndex] = temp
        updateInventory()
    }
}

function dropEmptyHandler(ev) {
    ev.preventDefault();
    const fromIndex = ev.dataTransfer.getData("fromIndex");
    const inv = getPlayer(getCurrentPlayerId()).inv
    inv[inv.length] = inv[fromIndex]
    removeInv(fromIndex)
    updateInventory()
}

function dropInsertHandler(ev, toIndex) {
    ev.preventDefault();
    const fromIndex = ev.dataTransfer.getData("fromIndex");
    if (fromIndex != toIndex && fromIndex + 1 != toIndex) {
        const inv = getPlayer(getCurrentPlayerId()).inv
        const item = inv[fromIndex]
        if (fromIndex < toIndex) {
            inv.splice(toIndex, 0, item)
            removeInv(fromIndex)
        }
        else {
            removeInv(fromIndex)
            inv.splice(toIndex, 0, item)
        }
        updateInventory()
    }
}

function dragEndHandler(ev) {
    document.querySelectorAll('.inv-insert-box').forEach((element) => {
        element.style['width'] = ''
    })
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