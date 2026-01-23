function setStoreScene() {
    //console.log('set scene.')

    const locationId = document.querySelector('#sel-location').value

    document.querySelector('#scene').innerHTML = `
        <div id="store-scene">
            <div class="store-top">
                <div id="store-name">${getLocation(locationId).name}</div>
            </div>
            <div id="store-content-container">
            </div>
            <div id="store-menu">
                <div id="menu">選單</div>
                <div id="sub-menu-effect">
                    <div id="sub-menu">
                        <div class='sub-menu-item' onclick='setStoreForVisit()'>參觀</div>
                        <div class='sub-menu-item' onclick='setStoreForBuy()'>購買</div>
                        <div class='sub-menu-item' onclick='setStoreForSell()'>出售</div>
                    </div>
                </div>
            </div>
        </div>`
}

function setStoreForVisit() {
    const player = getPlayer(getCurrentPlayerId())

    document.querySelector('#store-content-container').innerHTML = `
        <div class="store-content">
            <span class="noteworthy">${player.name}</span>正在店裏參觀
        </div>`
}

function setStoreForBuy() {
    document.querySelector('#store-content-container').innerHTML = `
        <div class="store-content">
            <div id="item-list"></div>
            <div class="mask"></div>
            <div id="cfm-panel">
                <div id="cfm-panel-1">
                    <input type="hidden" id="itemId-value">
                    <div class="cfm-item-name">名稱：<span class="name-value noteworthy"></span></div>
                    <div class="cfm-item-price">售價：<span class="price-value noteworthy"></span>元</div>
                    <div>
                        <label for="amount">數量：</label><input type="text" class="noteworthy" id="amount" maxlength="2"
                            onclick="this.select()">
                        <button type="button" onclick="setMaxAmount()">最大量</button>
                    </div>
                    <div class="v-separator"></div>
                    <div class="button-to-right">
                        <button type="button" class="cfm-panel-button" onclick="cancelBuy()">取消</button>
                        <button type="button" class="cfm-panel-button" onclick="confirmBuy()">確定</button>
                    </div>
                </div>
            </div>
        </div>`

    const locationId = document.querySelector('#sel-location').value
    document.querySelector('#item-list').innerHTML = ''
    getLocation(locationId).storeItems.forEach(itemId => {
        const temp = `
                <div class="item">
                    <div class="item-name">${getItem(itemId).name}</div>
                    <div class="item-price">${getItem(itemId).price} 元</div>
                    <div><button type="button" class="item-button" onclick="buy('${itemId}')">購買</div>
                </div>`
        document.querySelector('#item-list').innerHTML += temp
    })
}

function buy(itemId) {
    const item = getItem(itemId)
    document.querySelector('.mask').style.display = 'block'
    document.querySelector('#cfm-panel').style.display = 'block'
    document.querySelector('#cfm-panel-1 #itemId-value').value = itemId
    document.querySelector('#cfm-panel-1 .name-value').innerHTML = item.name
    document.querySelector('#cfm-panel-1 .price-value').innerHTML = item.price
    document.querySelector('#amount').value = 1
    document.querySelector('#amount').select()
    document.querySelector('#amount').focus()
    //console.log('buy:')
    //console.log(item)
}

function confirmBuy() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
    const itemId = document.querySelector('#cfm-panel-1 #itemId-value').value
    const item = getItem(itemId)
    const player = getPlayer(getCurrentPlayerId())
    let amount = parseInt(document.querySelector('#amount').value)
    if (amount > 0) {
        const total = item.price * amount
        if (player.gold < total) {
            console.log('錢不夠')
        }
        else {
            // 概念：尋找背包中已存在的該物品 invItems
            // 一邊暂存背包中的物品數量，一邊補滿背包中的堆疊
            const invItems = pickByItemId(itemId)
            const tempAmount = []
            invItems.forEach((invItem, index) => {
                tempAmount[index] = invItem.amount
                // 是否滿一個堆疊
                if (invItem.amount < maxPile) {
                    // 還差多少滿一個堆疊
                    const diff = maxPile - invItem.amount
                    if (diff < amount) {
                        invItem.amount = maxPile
                        amount -= diff
                    }
                    else {
                        invItem.amount += amount
                        amount = 0
                    }
                }
            })

            // 若有剩餘數量
            if (amount > 0) {
                // 若背包尚有多餘空間，則建立新的堆疊，並扣掉購買金額
                if (getCurrentInventorySize() < maxInventorySize) {
                    addInv(itemId, amount)
                    player.gold -= total
                }
                else {
                    // 若背包空間不夠，則 rollback -> 將暫存(tempAmount)的 amount 寫回原來的背包堆疊
                    invItems.forEach((invItem, index) => {
                        invItem.amount = tempAmount[index]
                    })
                    console.log('背包空間不足。')
                }
            }
        }
        //console.log('total:' + getItem(itemId).price * amount)
    }

    updateInventory()
    //console.log(getPlayer(getCurrentPlayerId()).inv)
}

function cancelBuy() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
}

function setStoreForSell() {
    document.querySelector('#store-content-container').innerHTML = `
        <div class="store-content">
            <div id="item-list"></div>
            <div class="mask"></div>
            <div id="cfm-panel">
                <div id="cfm-panel-1">
                    <input type="hidden" id="inv-index">
                    <div class="cfm-item-name">名稱：<span class="name-value noteworthy"></span></div>
                    <div class="cfm-item-price">售價：<span class="price-value noteworthy"></span>元</div>
                    <div>
                        <label for="amount">數量：</label><input type="text" class="noteworthy" id="amount" maxlength="2"
                            onclick="this.select()">
                    </div>
                    <div class="v-separator"></div>
                    <div class="button-to-right">
                        <button type="button" class="cfm-panel-button" onclick="cancelSell()">取消</button>
                        <button type="button" class="cfm-panel-button" onclick="confirmSell()">確定</button>
                    </div>
                </div>
            </div>
        </div>`

    const invItems = pickOneCategory('item')
    if (invItems.length > 0) {
        document.querySelector('#item-list').innerHTML = ''
        invItems.forEach((invItem) => {
            const temp = `
                <div class="item">
                    <div class="item-name">${getItem(invItem.item.itemId).name}</div>
                    <div class="item-price">${invItem.item.amount} 個</div>
                    <div><button type="button" class="item-button" onclick="sell('${invItem.index}')">出售</div>
                </div>`
            document.querySelector('#item-list').innerHTML += temp
        });
    }
    else {
        document.querySelector('#store-content-container').innerHTML = `
            <div class="store-content">
                <span class="noteworthy">背包內沒有 物品 可賣</span>
            </div>`
    }
}

function sell(index) {
    const invItem = pick(index)
    const item = getItem(invItem.itemId)
    document.querySelector('.mask').style.display = 'block'
    document.querySelector('#cfm-panel').style.display = 'block'
    document.querySelector('#cfm-panel-1 #inv-index').value = index
    document.querySelector('#cfm-panel-1 .name-value').innerHTML = item.name
    document.querySelector('#cfm-panel-1 .price-value').innerHTML = Math.floor(item.price * discount)
    document.querySelector('#amount').value = invItem.amount
    document.querySelector('#amount').select()
    document.querySelector('#amount').focus()
    //console.log('sell:')
    //console.log(item)
}


function confirmSell() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
    const index = document.querySelector('#cfm-panel-1 #inv-index').value
    const player = getPlayer(getCurrentPlayerId())

    const amount = parseInt(document.querySelector('#amount').value)
    if (amount > 0) {
        const invItem = pick(index)
        const item = getItem(invItem.itemId)
        if (invItem) {
            if (invItem.amount < amount) {
                console.log(`沒那麼多東西能賣(${invItem.amount})`)
            }
            else {
                player.gold += amount * Math.floor(item.price * discount)
                invItem.amount -= amount
                if (invItem.amount <= 0) {
                    removeInv(index)
                }
            }
        }
        else {
            console.log(`物品不存在`)
        }
        //console.log('total:' + getItem(itemId).price * amount)
    }

    updateInventory()
    setStoreForSell()
    //console.log(getPlayer(getCurrentPlayerId()).inv)
}

function cancelSell() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
}

function setMaxAmount() {
    const player = getPlayer(getCurrentPlayerId())
    const itemId = document.querySelector('#cfm-panel-1 #itemId-value').value
    const item = getItem(itemId)
    const maxBuy = Math.floor(player.gold / item.price)
    if (maxBuy < maxPile) {
        document.querySelector('#amount').value = maxBuy
    }
    else {
        document.querySelector('#amount').value = maxPile
    }
}