window.$ = window.jQuery = require('jquery')
const remote = require('electron').remote

var tasks = 0
var beginTask = 0
var total = 0
var excess = 0
var timer
var timing = false

function main() {
    $('#stop').prop('disabled', true)
    $('#next').prop('disabled', true)
    $('#tasks').html(tasks)
    $('#total').html(Math.round(total / 1000 / 60) + " minutes")
    $('#excess').html(Math.round(excess / 1000 / 60) + " minutes")
}

function update() {
    var d = Date.now() - beginTask + total
    var r = 1000 * 60 * Number($('#expected').prop('value')) - d + excess
    $('#total').html(Math.round(d / 1000 / 60 * 100)/100 + " minutes")
    $('#excess').html(Math.round(r / 1000 / 60 * 100)/100 + " minutes")
}

function start() {
    timing = true
    beginTask = Date.now()
    $('#start').prop('disabled', true)
    $('#stop').prop('disabled', false)
    $('#next').prop('disabled', false)
    timer = setInterval(update, 10)
    remote.getCurrentWindow().greenTray()
}

function stop() {
    timing = false
    tasks++
    var d = Date.now() - beginTask
    var rt = 1000 * 60 * Number($('#expected').prop('value'))
    total += d
    excess += rt - d
    clearInterval(timer)
    $('#tasks').html(tasks)
    $('#total').html(Math.round(total / 1000 / 60) + " minutes")
    $('#excess').html(Math.round(excess / 1000 / 60) + " minutes")
    $('#start').prop('disabled', false)
    $('#stop').prop('disabled', true)
    $('#next').prop('disabled', true)
    remote.getCurrentWindow().redTray()
}

function next() {
    if (timing) {
        stop()
    }
    start()
}
