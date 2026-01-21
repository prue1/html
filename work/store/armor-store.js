function setArmorStoreScene() {
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
                        <div class='sub-menu-item' onclick='setArmorStoreForVisit()'>參觀</div>
                        <div class='sub-menu-item' onclick='setArmorStoreForBuy()'>採買</div>
                        <div class='sub-menu-item' onclick='setArmorStoreForSell()'>出售</div>
                    </div>
                </div>
            </div>
        </div>`
}

function setArmorStoreForVisit() {
    const player = getPlayer(getCurrentPlayerId())

    document.querySelector('#store-content-container').innerHTML = `
        <div class="store-content">
            <span class="noteworthy">${player.name}</span>正在店裏參觀
        </div>`
}

function setArmorStoreForBuy() {

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
                    </div>
                    <div class="button-to-right">
                        <button type="button" class="cfm-panel-button" onclick="cancelBuyArmor()">取消</button>
                        <button type="button" class="cfm-panel-button" onclick="confirmBuyArmor()">確定</button>
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
                    <div><button type="button" class="item-button" onclick="buyArmor('${itemId}')">購買</div>
                </div>`
        document.querySelector('#item-list').innerHTML += temp
    })
}

function buyArmor(itemId) {
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

function confirmBuyArmor() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
    const itemId = document.querySelector('#cfm-panel-1 #itemId-value').value
    const item = getItem(itemId)
    const player = getPlayer(getCurrentPlayerId())
    const amount = parseInt(document.querySelector('#amount').value)
    if (amount > 0) {
        const total = item.price * amount
        if (player.gold < total) {
            console.log('錢不夠')
        }
        else {
            const inv = player.inv
            const itemInInv = pickByItemId(itemId)
            if (itemInInv) {
                if (amount > maxPile - itemInInv.amount) {
                    console.log('超過最大堆疊數量')
                }
                else {
                    player.gold -= total
                    itemInInv.amount += amount
                }
            }
            else {
                player.gold -= total
                addInv(itemId, amount)
            }
        }
        //console.log('total:' + getItem(itemId).price * amount)
    }

    updateInventory()
    //console.log(getPlayer(getCurrentPlayerId()).inv)
}

function cancelBuyArmor() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
}

function setArmorStoreForSell() {

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
                    </div>
                    <div class="button-to-right">
                        <button type="button" class="cfm-panel-button" onclick="cancelSellArmor()">取消</button>
                        <button type="button" class="cfm-panel-button" onclick="confirmSellArmor()">確定</button>
                    </div>
                </div>
            </div>
        </div>`

    const invArmors = pickOneCategory('armor')
    if (invArmors.length > 0) {
        document.querySelector('#item-list').innerHTML = ''
        invArmors.forEach((invArmor) => {
            const temp = `
                <div class="item">
                    <div class="item-name">${getItem(invArmor.itemId).name}</div>
                    <div class="item-price">${invArmor.amount} 個</div>
                    <div><button type="button" class="item-button" onclick="sellArmor('${invArmor.itemId}')">出售</div>
                </div>`
            document.querySelector('#item-list').innerHTML += temp
        });
    }
    else {
        document.querySelector('#store-content-container').innerHTML = `
            <div class="store-content">
                <span class="noteworthy">背包內沒有 防具 可賣</span>
            </div>`
    }
}

function sellArmor(itemId) {
    const item = getItem(itemId)
    document.querySelector('.mask').style.display = 'block'
    document.querySelector('#cfm-panel').style.display = 'block'
    document.querySelector('#cfm-panel-1 #itemId-value').value = itemId
    document.querySelector('#cfm-panel-1 .name-value').innerHTML = item.name
    document.querySelector('#cfm-panel-1 .price-value').innerHTML = Math.floor(item.price * discount)
    document.querySelector('#amount').value = pickByItemId(itemId).amount
    document.querySelector('#amount').select()
    document.querySelector('#amount').focus()
    //console.log('sell:')
    //console.log(item)
}


function confirmSellArmor() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
    const itemId = document.querySelector('#cfm-panel-1 #itemId-value').value
    const item = getItem(itemId)
    const player = getPlayer(getCurrentPlayerId())
    const amount = parseInt(document.querySelector('#amount').value)
    if (amount > 0) {
        const invItem = pickByItemId(itemId)
        if (invItem) {
            if (invItem.amount < amount) {
                console.log(`沒那麼多東西可賣(${invItem.amount})`)
            }
            else {
                player.gold += amount * Math.floor(item.price * discount)
                invItem.amount -= amount
                if (invItem.amount <= 0) {
                    removeInv(itemId)
                }
            }
        }
        else {
            console.log(`防具不存在`)
        }
        //console.log('total:' + getItem(itemId).price * amount)
    }

    updateInventory()
    setStoreForSell()
    //console.log(getPlayer(getCurrentPlayerId()).inv)
}

function cancelSellArmor() {
    document.querySelector('#cfm-panel').style.display = 'none'
    document.querySelector('.mask').style.display = 'none'
}