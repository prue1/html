/*
注意：這個 function 會經常用到。
目的是將整個背包刷新為最初狀態--也就是，不包含任何的掭加視窗(選單)。
一些自行添加視窗的 function，可以在流程最後加上 updateInventory()，簡化清除視窗的過程。
 */
function updateInventory() {
    const player = getPlayer(getCurrentPlayerId())
    const inv = player.inv
    document.querySelector('#inventory-container').innerHTML = `
        <div class="inv-title">錢：${player.gold} 元</div>
        <div class="inv-title">背包空間(最大：${maxInventorySize})：</div>
        <div class="inv-title">已使用：${getCurrentInventorySize()}，剩餘：${maxInventorySize - getCurrentInventorySize()}</div>
        <div id="item-container"></div>
        <div id="inv-action-panel"></div>`

    inv.forEach((invItem, index) => {
        let temp = ''
        if (getItemInfo(invItem.itemId).category == 'item') {
            temp = `
                <div class="inv-item inv-item-bacground">
                    <div class="inv-insert-box"
                        ondragenter="dragEnter(event, this)"
                        ondragleave="dragLeave(event, this)"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropInsertHandler(event, ${index}, this)">
                        <img width="20" height="32" class="disable-event-when-dragging" src="image/down-arrow.gif">
                    </div>
                    <div class="inv-item-name inv-item-name-${index}"
                        draggable="true"
                        ondragstart="dragstartHandler(event, ${index})"
                        ondragenter="dragEnter(event, this)"
                        ondragleave="dragLeave(event, this)"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropHandler(event, ${index})"
                        ondragend="dragEndHandler(event)"
                        onclick=panelForItem('${index}')>
                        <div class="inv-item-image"><img width="16" height="16" src="image/${getItemInfo(invItem.itemId).image}"></div>
                        <span class="disable-event-when-dragging">${getItemInfo(invItem.itemId).name}</span>
                        <span class="noteworthy disable-event-when-dragging">${invItem.amount}</span>
                    </div>
                </div>`
        }
        else if (getItemInfo(invItem.itemId).category == 'armor') {
            temp = `
                <div class="inv-item inv-armor-bacground">
                    <div class="inv-insert-box"
                        ondragenter="dragEnter(event, this)"
                        ondragleave="dragLeave(event, this)"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropInsertHandler(event, ${index}, this)">
                        <img width="20" height="32" class="disable-event-when-dragging" src="image/down-arrow.gif">
                    </div>
                    <div class="inv-item-name inv-item-name-${index}"
                        draggable="true"
                        ondragstart="dragstartHandler(event, ${index})"
                        ondragenter="dragEnter(event, this)"
                        ondragleave="dragLeave(event, this)"
                        ondragover="dragoverHandler(event)"
                        ondrop="dropHandler(event, ${index})"
                        ondragend="dragEndHandler(event)"
                        onclick=equipItem('${index}')>
                        <span class="disable-event-when-dragging">${getItemInfo(invItem.itemId).name}</span>
                        <span class="noteworthy disable-event-when-dragging">${invItem.amount}</span>
                    </div>
                </div>`
        }

        document.querySelector('#item-container').innerHTML += temp
    });

    for (let index = inv.length; index < maxInventorySize; index++) {
        temp = `
            <div class="inv-item inv-empty-bacground">
                <div class="inv-empty"
                    ondragenter="dragEnter(event, this)"
                    ondragleave="dragLeave(event, this)"
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

    ev.dataTransfer.setDragImage(
        customDragImage,
        0,
        0
    );

    document.querySelectorAll('.inv-insert-box').forEach((element) => {
        element.style['width'] = '20px'
    })

    // 當鼠標移到 <span> 時，會觸發 mouseleave event，導致邊框效果消失，故在drag期間先 disable 掉。
    //pointer-events: 'none';
    document.querySelectorAll('.disable-event-when-dragging').forEach((element) => {
        element.style['pointer-events'] = 'none'
    })
}

function dragEnter(ev, el) {
    //console.log('enter')
    el.style['backgroundColor'] = 'orange'
}

function dragLeave(ev, el) {
    //console.log('leave')
    el.style['backgroundColor'] = ''
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
    const invItem = inv[fromIndex]
    const item = getItemInfo(invItem.itemId)
    // item 才能拆分
    if (item.category == 'item') {
        // 數量大於 1 才能拆分
        if (invItem.amount > 1) {
            // 顯示拆分視窗
            showBreakDownPanel(fromIndex)
            return
        }
        else {
            // 否則，做移動
            inv[inv.length] = invItem
            removeInv(fromIndex)
        }
    }
    else {
        // 非 item，做移動
        inv[inv.length] = invItem
        removeInv(fromIndex)
    }
    updateInventory()
}

function showBreakDownPanel(index) {
    const inv = getPlayer(getCurrentPlayerId()).inv
    const invItem = inv[index]
    const invActionPanel = document.querySelector('#inv-action-panel')
    invActionPanel.style.display = 'block'
    invActionPanel.innerHTML = ''
    invActionPanel.innerHTML += `
        <div>
            【<img width="16" height="16" src="image/${getItemInfo(invItem.itemId).image}">
            ${getItemInfo(invItem.itemId).name}<span class="noteworthy">${invItem.amount}</span>】
            <label for="breakdownAmamount">拆分數量</label><input type="number" class="noteworthy" id="breakdownAmamount" min="0" max="${invItem.amount}">
            <button type="button" class="small-button" onclick="breakDown(${index})">拆分</button>
            <button type="button" class="small-button" onclick="hideBreakDownPanel()">取消</button>
        </div>
        <div>第二行<button type="button" class="small-button">按鈕</button></div>
        <div>第三行<button type="button" class="small-button">按鈕</button></div>
        <div>第四行<button type="button" class="small-button">按鈕</button></div>
        <div>第五行<button type="button" class="small-button">按鈕</button></div>`

    document.querySelector('#breakdownAmamount').value = 1
    document.querySelector('#breakdownAmamount').select()
}

function breakDown(index) {
    const breakdownAmount = document.querySelector('#breakdownAmamount').value
    const inv = getPlayer(getCurrentPlayerId()).inv
    const invItem = inv[index]
    if (breakdownAmount > 0) {
        if (breakdownAmount <= invItem.amount) {
            invItem.amount -= breakdownAmount
            if (invItem.amount <= 0) {
                removeInv(index)
            }
            addInv(invItem.itemId, breakdownAmount)
        }
        else {
            console.log(`拆分數量(${breakdownAmount})大於原數量(${invItem.amount})`)
        }
    }
    else {
        console.log(`拆分數量<1:${breakdownAmount}`)
    }
    updateInventory()
}

function hideBreakDownPanel() {
    document.querySelector('#inv-action-panel').style.display = 'none'
    updateInventory()
}

function dropInsertHandler(ev, toIndex, element) {
    element.style['backgroundColor'] = ''
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

    //pointer-events: 'none';
    document.querySelectorAll('.disable-event-when-dragging').forEach((element) => {
        element.style['pointer-events'] = 'all'
    })

    // 如果 drop 在原處，則邊框會保留(無 leave event，也不會刷新背包)
    // 故另外處理
    ev.target.style['backgroundColor'] = ''
}

function panelForItem(index) {
    const invActionPanel = document.querySelector('#inv-action-panel')
    invActionPanel.style.display = 'block'
    invActionPanel.innerHTML = ''
    invActionPanel.innerHTML += `
        <div>
            <button type="button" class="small-button" onclick="consumeItem(${index})">使用</button>
        </div>
        <div>
            <button type="button" class="small-button" onclick="shiftItem(${index})">轉移</button>
        </div>
        <div>
            <button type="button" class="small-button" onclick="throwAwayItem(${index})">丟棄</button>
        </div>
        <div>
            <button type="button" class="small-button" onclick="closeActionPanel()">取消</button>
        </div>`
}

function consumeItem(index) {
    const inv = getPlayer(getCurrentPlayerId()).inv
    const invItem = inv[index]
    invItem.amount -= 1
    if (invItem.amount <= 0) {
        removeInv(index)
    }
    updateInventory()
}

function throwAwayItem(index) {
    removeInv(index)
    updateInventory()
}

function shiftItem(index) {
    const invActionPanel = document.querySelector('#inv-action-panel')
    invActionPanel.style.display = 'block'
    invActionPanel.innerHTML = ''
    invActionPanel.innerHTML += `
        <div>
            <label for="choose-player">
                <select id="choose-player"></select>
                <button type="button" class="small-button" onclick="confirmShift(${index} ,'${getCurrentPlayerId()}')">確定</button>
                <button type="button" class="small-button" onclick="cancelShift()">取消</button>
            </label>
        </div>`

    document.querySelector('#choose-player').innerHTML = ''
    Object.entries(player).forEach(([playerId, data]) => {
        const temp = `
                <option value="${playerId}">${data.name}</option>`
        document.querySelector('#choose-player').innerHTML += temp
    });
}

function confirmShift(invIndex, fromPlayer) {
    const toPlayerId = document.querySelector('#choose-player').value

    const fromInv = getPlayer(fromPlayer).inv
    const toInv = getPlayer(toPlayerId).inv

    if (toInv.length < maxInventorySize) {
        const invItem = fromInv[invIndex]
        addByInv(toInv, invItem.itemId, invItem.amount)
        removeByInv(fromInv, invIndex)
    }
    else {
        // 收受方背包空間不夠的處理
    }
    updateInventory()
}

function cancelShift() {
    updateInventory()
}

function closeActionPanel() {
    document.querySelector('#inv-action-panel').style.display = 'none'
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
        if (getItemInfo(inv[i].itemId).category == category) {
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

function addByInv(inv, itemId, amount) {
    inv[inv.length] = { 'itemId': itemId, 'amount': amount }
}

function removeInv(index) {
    getPlayer(getCurrentPlayerId()).inv.splice(index, 1)
}

function removeByInv(inv, index) {
    inv.splice(index, 1)
}