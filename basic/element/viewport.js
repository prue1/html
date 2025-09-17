const color = ['#448D76', '#B2D732', '#8601AF', '#AE0D7A', '#FCCB1A']

function setup() {
    const movingPanel = document.querySelector(".moving-panel")
    for (let i = 0; i < 12; i++) {
        let template = `
            <div id="moving-box-${i + 1}" class="display-layout" onmousedown="do_down(this, event)">
                <div class="display-top"></div>
                <div class="display-content">
                </div>
            </div>`
        movingPanel.innerHTML += template
    }

    const displayLayout = document.querySelectorAll(".display-layout")
    let i = 0
    for (let i = 0; i < displayLayout.length; i++) {
        const ele = displayLayout[i]
        const clr = color[i % color.length]

        // 注意: i/7 不是整除, 而是得到浮點數, 透過 parseInt() 得到與整除相同的結果。
        // 也可使用這個函式 Math.floor(i / 7) * 20
        const offset = parseInt(i / 7) * 20

        ele.style.top = `${(100 + offset + (i % 7) * 35)}px`
        ele.style.left = `${(100 + offset + (i % 7) * 70)}px`
        ele.style.zIndex = i + 1
        ele.style.WebkitUserSelect = 'none'
        ele.style.MsUserSelect = 'none'
        ele.style.userSelect = 'none'

        const displayTop = ele.querySelector(".display-top")
        displayTop.style.backgroundColor = clr
        displayTop.style.border = `3px ridge ${clr}`
        displayTop.style.borderRadius = '10px 10px 0 0'

        const displayContent = ele.querySelector(".display-content")
        displayContent.style.backgroundColor = 'white'
        displayContent.style.borderRight = `3px ridge ${clr}`
        displayContent.style.borderBottom = `3px ridge ${clr}`
        displayContent.style.borderLeft = `3px ridge ${clr}`
        displayContent.style.borderRadius = '0 0 10px 10px'
    }
}

function do_click() {
    // 取得 viewport 大小
    document.querySelector("#innerWidth").innerHTML = window.innerWidth
    document.querySelector("#innerHeight").innerHTML = window.innerHeight
}

// 搭配 event, 當window大小改變時, 取得新的 viewport 大小
window.addEventListener("resize", function () {
    document.querySelector("#innerWidth").innerHTML = window.innerWidth
    document.querySelector("#innerHeight").innerHTML = window.innerHeight
});

let pressed = false
let x = 0
let y = 0
let t = 0
let l = 0
let element
function do_down(e, event) {
    x = event.screenX
    y = event.screenY
    t = parseInt(e.style.top)
    l = parseInt(e.style.left)
    element = e

    const displayLayout = document.querySelectorAll(".display-layout")
    for (let i = 0; i < displayLayout.length; i++) {
        const ele = displayLayout[i]
        // 注意:數字比大小時, 若不做 parseInt(), 那麼會變成以"字串"來比對, 而得到錯誤的結果。
        if (ele.id != e.id && parseInt(ele.style.zIndex) > parseInt(e.style.zIndex)) {
            ele.style.zIndex = parseInt(ele.style.zIndex) - 1
        }
    }
    e.style.zIndex = displayLayout.length
    pressed = true
}

function do_up() {
    pressed = false
    let x = 0
    let y = 0
    let t = 0
    let l = 0
    element = ''
}

function do_move(event) {
    let ex = event.screenX
    let ey = event.screenY
    if (pressed) {
        let newX = l + (ex - x)
        let newY = t + (ey - y)
        newX = newX < 0 ? 0 : newX
        newY = newY < 0 ? 0 : newY

        element.style.left = `${newX}px`
        element.style.top = `${newY}px`
    }
}