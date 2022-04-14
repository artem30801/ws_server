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

    var coordinates = document.createElement('td')
    // coordinates.appendChild(document.createTextNode(data['coordinates']))
    var x = document.createElement('td')
    x.classList.add('ui', 'red', 'text')
    x.appendChild(document.createTextNode(data['coordinates'][0] + '    '))
    var y = document.createElement('td')
    y.classList.add('ui', 'green', 'text')
    y.appendChild(document.createTextNode(data['coordinates'][1] + '    '))
    var z = document.createElement('td')
    z.classList.add('ui', 'blue', 'text')
    z.appendChild(document.createTextNode(data['coordinates'][2]))

    // coordinates.appendChild(x)
    // coordinates.appendChild(y)
    // coordinates.appendChild(z)

    // message.appendChild(coordinates)

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

    var container = document.getElementById("container");
    // container.scrollTop = container.scrollHeight;
    container.scroll({ top: container.scrollHeight, behavior: 'smooth' })

}

function on_total(data) {
    var section = document.querySelector(`td[section_id="${data['section']}"]`)
    console.log(data)
    console.log(section)
    section.innerHTML = data['count']
}

function connect() {
    var ws = new WebSocket('ws://' + location.host + '/ws/connect');

    ws.onmessage = function (event) {
        var data = JSON.parse(event.data)
        var type = data['type']
        var content = data['content']

        if (type == 'detected') {
            on_detected(content)
        }
        else if (type == 'total') {
            on_total(content)
        }
    };

    ws.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };

    ws.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

connect();
