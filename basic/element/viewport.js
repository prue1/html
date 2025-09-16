function do_click() {
    document.querySelector("#innerWidth").innerHTML = window.innerWidth
    document.querySelector("#innerHeight").innerHTML = window.innerHeight
}

window.addEventListener("resize", function () {
    document.querySelector("#innerWidth").innerHTML = window.innerWidth
    document.querySelector("#innerHeight").innerHTML = window.innerHeight
});


let pressed = false
let x = 0
let y = 0
function do_down(event) {
    x = event.clientX
    y = event.clientY
    pressed = true
    console.log("down")
}

function do_up() {
    pressed = false
    x = 0
    y = 0
    console.log("up")
}

function do_move(e, event) {
    if (pressed) {
        console.log("move:")
        let ex = event.clientX
        let ey = event.clientY
        e.style.left = parseInt(e.style.left) + (ex - x) + 'px'
        e.style.top = parseInt(e.style.top) + (ey - y) + 'px'
        x = ex
        y = ey
        console.log("x:" + ex)
        console.log("y:" + ey)
    }
}