const items = {
    'i01': { category: 'item', name: '藥草', price: 3, image: 'vine.png' },
    'i02': { category: 'item', name: '金創藥', price: 5, image: 'hp-potion.png' },
    'i03': { category: 'item', name: '小還丹', price: 10, image: 'dan.png' },
    'i04': { category: 'item', name: '大還丹', price: 15, image: 'dan.png' },
    'i05': { category: 'item', name: '解毒丹', price: 5, image: 'dan.png' },
    'i06': { category: 'item', name: '小復活丹', price: 10, image: 'dan.png' },
    'i07': { category: 'item', name: '大復活丹', price: 20, image: 'dan.png' },
    'i08': { category: 'item', name: '行氣散', price: 12, image: 'hp-potion.png' },
    'i09': { category: 'item', name: '加速丹', price: 13, image: 'dan.png' },
    'i10': { category: 'item', name: '防禦丹', price: 17, image: 'dan.png' },
    'i11': { category: 'item', name: '辟邪丹', price: 20, image: 'dan.png' },
    'i12': { category: 'item', name: '天香斷續膏', price: 9, image: 'gao.png' },
    'i13': { category: 'item', name: '迷香', price: 9, image: 'xiang.png' },
    'a01': { category: 'armor', name: '銅甲', price: 5 },
    'a02': { category: 'armor', name: '鐵甲', price: 10 },
    'a03': { category: 'armor', name: '鎖子甲', price: 20 },
    'w01': { category: 'weapon', name: '銅劍', price: 10 },
    'w02': { category: 'weapon', name: '鐵劍', price: 20 },
    'w03': { category: 'weapon', name: '長棍', price: 10 },
}

const locations = {
    'store1': { category: 'item-store', name: '很有效藥店', storeItems: ['i01', 'i02', 'i03', 'i12'] },
    'store2': { category: 'item-store', name: '大百貨藥行', storeItems: ['i02', 'i03', 'i04', 'i05', 'i06', 'i12'] },
    'store3': { category: 'item-store', name: '萬全藥莊', storeItems: ['i01', 'i02', 'i03', 'i04', 'i05', 'i06', 'i07', 'i08', 'i09', 'i10', 'i11', 'i12', 'i13'] },
    'armor1': { category: 'armor-store', name: '防具店', storeItems: ['a01', 'a03'] },
    'armor2': { category: 'armor-store', name: '防具二號店', storeItems: ['a01', 'a02', 'a03'] },
    'weapon1': { category: 'weapon-store', name: '武器店', storeItems: ['w01', 'w02', 'w03'] },
}

/*
inv = [{itemId:itemId, amount:amount}, {}, .....]
*/
const player = {
    'player1': { name: '海賊王', gold: 1000, inv: [], location: 'store1' },
    'player2': { name: '飛天小女警', gold: 1000, inv: [], location: 'store1' },
    'player3': { name: '海棉寶寶', gold: 1000, inv: [], location: 'store2' },
    'player4': { name: '風之谷', gold: 1000, inv: [], location: 'store2' },
    'player5': { name: '科學小飛俠', gold: 1000, inv: [], location: 'store3' },
    'player6': { name: '秀逗魔導士', gold: 1000, inv: [], location: 'store3' },
}

const maxInventorySize = 16
const maxPile = 99
const discount = 0.75
const startPlayer = { player: 'player6' }
