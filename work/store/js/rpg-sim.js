function getItem(itemId) {
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
    document.querySelector('#player-id').value = playerId
    document.querySelector('#sel-player').value = playerId
    document.querySelector('#sel-location').value = getPlayer(playerId).location
    setupLocation()
    updateInventory()
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