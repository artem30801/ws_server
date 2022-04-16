function on_detected(data) {
    var messages = document.getElementById('messages')
    var message = document.createElement('tr')

    var sender = document.createElement('td')
    sender.appendChild(document.createTextNode(data['sender']))
    message.appendChild(sender)

    var timestamp = document.createElement('td')
    var now = new Date().toLocaleTimeString('ru-RU')
    timestamp.appendChild(document.createTextNode(now))
    message.appendChild(timestamp)

    var item = document.createElement('td')
    item.appendChild(document.createTextNode(data['item']))
    message.appendChild(item)

    var x = document.createElement('td')
    x.classList.add('ui', 'red', 'text')
    x.appendChild(document.createTextNode(data['coordinates'][0] + '    '))
    var y = document.createElement('td')
    y.classList.add('ui', 'green', 'text')
    y.appendChild(document.createTextNode(data['coordinates'][1] + '    '))
    var z = document.createElement('td')
    z.classList.add('ui', 'blue', 'text')
    z.appendChild(document.createTextNode(data['coordinates'][2]))

    message.appendChild(x)
    message.appendChild(y)
    message.appendChild(z)


    var section = document.createElement('td')

    var section_colors = {
        1: "red",
        2: "yellow",
        3: "blue",
        4: "purple",
        5: "green",
        6: "teal"
    }
    section.classList.add('right', 'marked', section_colors[data['section']])

    icon = document.createElement('i')
    icon.classList.add('icon')

    if (data['correct']) {
        section.classList.add('positive')
        icon.classList.add('checkmark')
    }
    else {
        section.classList.add('negative')
        icon.classList.add('close')
    }
    section.appendChild(icon)
    section.appendChild(document.createTextNode(data['section']))
    message.appendChild(section)

    messages.appendChild(message)
    $(message).transition('fade up in', '700ms');

    var container = document.getElementById("container");
    container.scroll({ top: container.scrollHeight, behavior: 'smooth' })

}

function on_total(data) {
    $(`[section_id="${data['section']}"]`)
        .transition('fade down out')
        .delay(200)
        .queue(function (n) {
            $(this).html(data['count']);
            n();
        })
        .delay(200)
        .transition('fade up in')
        ;
}

function detected_clear() {
    var messages = document.getElementById('messages')
    messages.innerHTML = ''
}

function total_clear() {
    var sections = document.querySelectorAll('[section_id]')
    for (const section of sections) {
        section.innerHTML = '0'
    }
}

function clear_all(reason) {
    console.log("Cleared")
    detected_clear()
    total_clear()

    $('body')
        .toast({
            displayTime: 'auto',
            class: 'info',
            title: 'Cleared all data',
            message: reason
        })
        ;
}


function connect() {
    var ws = new WebSocket('ws://' + location.host + '/ws/connect');

    ws.onmessage = function (event) {
        var data = JSON.parse(event.data)
        var type = data['type']
        var sender = data['sender']
        var content = data['content']

        var sender_filter = document.getElementById('sender_filter').value
        if (sender_filter != '' && sender_filter != sender) {
            $('body')
                .toast({
                    // displayTime: 'auto',
                    class: 'warning',
                    title: 'Filtered message out',
                    message: `Dropped <span class="ui label">${type}</span> message by <span class="ui label">${sender}</span>`
                })
                ;

            return
        }

        if (type == 'detected') {
            content['sender'] = sender
            on_detected(content)
        }
        else if (type == 'total') {
            on_total(content)
        }
        else if (type == 'clear') {
            clear_all(`By request from <span class="ui label">${sender}</span>`)
        }
    };

    ws.onopen = function (e) {
        console.log('Socket connected');
        $('body')
            .toast({
                class: 'success',
                title: 'Socket connected.',
            })
            ;

    }

    ws.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 3000);

        $('body')
            .toast({
                displayTime: '3000',
                showProgress: 'bottom',
                classProgress: 'blue',
                class: 'error',
                title: 'Socket is closed.',
                message: 'Reconnect will be attempted in <span class="ui label">3</span> seconds.'
            })
            ;
    };

    ws.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();

        $('body')
            .toast({
                class: 'error',
                title: 'Socket encountered error:',
                message: err.message ?? 'Can not connect.'
            })
            ;
    };
}

connect();
