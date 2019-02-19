window.$ = window.jQuery = require('jquery')
const remote = require('electron').remote

var tasks = 0
var beginTask = 0
var total = 0
var excess = 0
var timer
var timing = false

const fs = require('fs');

function snapshot() {
    return {
        'expected': Number($('#expected').val()),
        'tasks': tasks,
        'total': total,
        'excess': excess
    }
}

function save() {
    fs.writeFileSync('data.txt', JSON.stringify(snapshot()), 'utf-8')
}

function read() {
    try {
        var obj = JSON.parse(fs.readFileSync('data.txt'))
        $('#expected').val(obj.expected)
        tasks = obj.tasks
        total = obj.total
        excess = obj.excess
    } catch {
        save()
    }
}

function editLock() {
    if ($('#editLock').html() === 'Edit') {
        $('#editLock').html('Lock')
        $('#start').prop('disabled', true)
        $('#newSession').prop('disabled', true)
        $('.stat').hide()
        $('.stat-edit').show()
        $('#tasks-edit').val(Math.round(tasks / 1000 / 60))
        $('#total-edit').val(Math.round(total / 1000 / 60))
        $('#excess-edit').val(Math.abs(Math.round(excess / 1000 / 60)))
        if (excess < 0) {
            $('#aheadBehind').val('behind')
        } else {
            $('#aheadBehind').val('ahead')
        }
    } else {
        $('#start').prop('disabled', false)
        $('#newSession').prop('disabled', false)
        $('.stat').show()
        $('.stat-edit').hide()
        $('#editLock').html('Edit')
        tasks = Number($('#tasks-edit').val())
        total = Number($('#total-edit').val()) * 60 * 1000
        excess = ($('#aheadBehind').val() == "ahead" ? 1 : -1) * Number($('#excess-edit').val()) * 60 * 1000
        $('#tasks').html(tasks)
        $('#total').html(Math.round(total / 1000 / 60))
        setExcess(excess)
        save()
    }
}

function newSession() {
    remote.getCurrentWindow().confirmation("Do you really want to start a new session?",
        (response) => {
            if (response === 0) {
                stop()
                tasks = 0
                total = 0
                excess = 0
                save()
                init()
            }
    })
}

function setExcess(excess) {
    if (timing) {
        $('#excess').html(Math.abs(Math.round(excess / 1000 / 60 * 100)/100))
    } else {
        $('#excess').html(Math.abs(Math.round(excess / 1000 / 60)))
    }
    $('#excessDir').html(excess < 0 ? "behind" : "ahead")
    $('#excessDir').css('color', excess < 0 ? 'red' : 'blue')
}


function init() {
    read()
    $('#start').prop('disabled', false)
    $('#stop').prop('disabled', true)
    $('#next').prop('disabled', true)
    $('#tasks').html(tasks)
    $('#total').html(Math.round(total / 1000 / 60))
    setExcess(excess)
    $('.stat-edit').hide()
}

function update() {
    var d = Date.now() - beginTask
    var r = 1000 * 60 * Number($('#expected').prop('value')) - d + excess
    $('#total').html(Math.round((d + total) / 1000 / 60 * 100)/100)
    setExcess(r)
}

function start() {
    timing = true
    beginTask = Date.now()
    $('#start').prop('disabled', true)
    $('#stop').prop('disabled', false)
    $('#next').prop('disabled', false)
    timer = setInterval(update, 10)
    remote.getCurrentWindow().greenTray()
    $('#editLock').prop('disabled', true)
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
    $('#total').html(Math.round(total / 1000 / 60))
    setExcess(excess)
    $('#start').prop('disabled', false)
    $('#stop').prop('disabled', true)
    $('#next').prop('disabled', true)
    remote.getCurrentWindow().redTray()
    save()
    $('#editLock').prop('disabled', false)
}

function next() {
    if (timing) {
        stop()
    }
    start()
}
