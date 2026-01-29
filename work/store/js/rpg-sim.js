function getItemInfo(itemId) {
    return items[itemId]
}

function getPlayer(playerId) {
    return player[playerId]
}

function getLocation(locationId) {
    return locations[locationId]
}

function setup() {
    initPlayer()
    initLocation()
    setPlayer(startPlayer.player)
}

function initPlayer() {
    document.querySelector('#sel-player').innerHTML = ''
    Object.entries(player).forEach(([playerId, data]) => {
        const temp = `
                <option value="${playerId}">${data.name}</option>`
        document.querySelector('#sel-player').innerHTML += temp
    });
    // 設定初始值
    document.querySelector('#sel-player').value = startPlayer.player
}

function initLocation() {
    document.querySelector('#sel-location').innerHTML = ''
    Object.entries(locations).forEach(([itemId, data]) => {
        const temp = `
                <option value="${itemId}">${data.name}</option>`
        document.querySelector('#sel-location').innerHTML += temp
    });
}

function setPlayer(playerId) {
    setCurrentPlayerId(playerId)
    const player = getPlayer(playerId)
    // 設定 player location
    document.querySelector('#sel-location').value = player.location
    setPlayerStatus()
    setupLocation()
    updateInventory()
}

function setPlayerStatus() {
    const player = getPlayer(getCurrentPlayerId())
    const status = document.querySelector('#player-status')
    status.innerHTML = ''
    status.innerHTML += `
        <div>${player.name}</div>
        <div id="player-image-case"><img src="image/${player.picture.file}"></div>
    `
    const playerImageImg = document.querySelector('#player-image-case>img')
    playerImageImg.style.transform = `translate(-${player.picture.tx}px, -${player.picture.ty}px)`
}

function setupLocation() {
    const currentLocationId = document.querySelector('#sel-location').value
    getPlayer(getCurrentPlayerId()).location = currentLocationId

    const currentLocation = getLocation(currentLocationId)
    if (currentLocation.category == 'item-store') {
        setStoreScene()
        setStoreForVisit()
    }
    else if (currentLocation.category == 'armor-store') {
        setArmorStoreScene()
        setArmorStoreForVisit()
    }
    else if (currentLocation.category == 'weapon-store') {
    }
}

function getCurrentPlayerId() {
    return document.querySelector('#player-id').value
}

function setCurrentPlayerId(playerId) {
    document.querySelector('#player-id').value = playerId
}