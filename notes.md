# WebSockets

## Creating Express App

Create a default package.json
```shell
npm init -y
```

Install Express
```shell
npm i express
```

Hot reload
```shell
npm i nodemon -D
```

Add script to package.json
```json
{
  "name": "websockets",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.16.3"
  },
  "devDependencies": {
    "nodemon": "^1.18.3"
  }
}
```

Run nodemon
```shell
npm start
```

Install socket.io
```shell
npm i socket.io
```

## Chat App

### public/index.html
---
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>WebSockets</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <div id="mario-chat">
    <div id="chat-window">
      <div id="output"></div>
      <div id="feedback"></div>
    </div>

    <input id="handle" type="text" placeholder="Handle" />
    <input id="message" type="text" placeholder="Message" />
    <button id="send">Send</button>
  </div>

  <script src="chat.js"></script>
</body>

</html>
```

### public/styles.css
---
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

body {
  font-family: Montserrat, 'Segoe UI', Verdana, Arial, sans-serif;
  font-size: 62.5%;
  box-sizing: border-box;
}

h2 {
  font-size: 1.8rem;
  padding: 1rem 2rem;
  color: #575ed8;
}

#mario-chat {
  max-width: 600px;
  margin: 3rem auto;
  border: 1px solid #ddd;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.05);
}

#chat-window {
  height: 400px;
  overflow: auto;
  background: #f9f9f9;
}

#output p {
  font-size: 1rem;  
  padding: 1.4rem 0;
  margin: 0 2rem;
  border-bottom: 1px solid #e9e9e9;
  color: #555;
}

#feedback p {
  font-size: 1rem;  
  color: #aaa;
  padding: 1.4rem 0;
  margin: 0 2rem;
}

#output strong {
  color: #575ed8;
}

label {
  display: block;
  padding: 1rem 2rem;
}

input {
  padding: 1rem 2rem;
  background: #eee;
  border: 0;
  display: block;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;
  font-family: Montserrat, 'Segoe UI', Verdana, Arial, sans-serif;
  font-size: 1rem;
}

button {
  background: #575ed8;
  color: #fff;
  font-size: 1.2rem;
  border: 0;
  padding: 1.2rem 0;
  width: 100%;
  border-radius: 0 0 2px 2px;
}
```

### index.js
---
```js
const express = require('express');
const socket = require('socket.io');

// App setup
const app = express();
const server = app.listen(4000, () => {
  console.log('Listening to request on port 4000');
});

// Static files
app.use(express.static('public'));

// Socket setup
const io = socket(server);

// Listen for event
io.on('connection', (socket) => {
  console.log('🧦  Made socket connection', socket.id);

  // Handle chat event
  socket.on('chat', (data) => {
    // Make it so that everyone can see the message
    io.sockets.emit('chat', data);
  });

  socket.on('typing', (data) => {
    // Broadcast typing message
    socket.broadcast.emit('typing', data);
  });
});
```

### public/chat.js
---
```js
// Make connection
const socket = io.connect('http://localhost:4000');

// Query DOM
const message = document.getElementById('message');
const handle = document.getElementById('handle');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', () => {
  socket.emit('chat', {
    message: message.value,
    handle: handle.value,
  });
});

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
});

// Listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = '';
  
  output.innerHTML += `
    <p>
      <strong>${data.handle}:</strong> ${data.message}
    </p>
  `;
});

socket.on('typing', (data) => {
  feedback.innerHTML = `
    <p>
      <em>${data} is typing a message...</em>
    </p>
  `;
});
```