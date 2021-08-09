/* imports */

var fs = require('fs');

/* Parse Arguements */

const port_num = process.argv[2];

/* express and socket.io startup */

// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || parseInt(port_num);

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'css')));

// Game Room

let state = {
  loggedInUsers: [],
  messageLog: []
};

io.on('connection', (socket) => {
  let addedUser = false;
  let loggedIn = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    if (!loggedIn) {
      return;
    }
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: data.username,
      message: data.message
    });
    console.log('message!');
    state.messageLog.push({ username: data.username, message: data.message });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      for (let i = 0; i < state.loggedInUsers.length; i++) {
        if (state.loggedInUsers[i].username == socket.username) {
          delete state.loggedInUsers[i];
        }
      }
    }
  });

  socket.on('login user', (data) => {
    console.log('user logging in');
    let correct = false;
    fs.readFile('/tmp/accounts.json', (err, data) => {
      if (err) throw err;
      let accounts = JSON.parse(data);
      for (let i = 0; i < accounts.accounts.length; i++) {
        if (accounts.accounts[i].username == data.username) {
          correct = correct || accounts.accounts[i].password == data.password;
        }
      }
    });
    if (correct) {
      if (addedUser) return;
      loggedInUsers.push(data.username);
      addedUser = true;
    }
    loggedIn = true;
    console.log('emitting login ' + state.loggedInUsers.length);
    socket.emit('login', { numUsers: state.loggedInUsers.length, messages: state.messageLog.slice(Math.max(state.messageLog.length - 100, 0)) });
    console.log('user logged in');
  });

  socket.on('register user', (data) => {
    fs.readFile('/tmp/accounts.json', (err, dataF) => {
      if (err) throw err;
      let accounts = JSON.parse(dataF);
      if (!Array.isArray(accounts.accounts)) {
        accounts.accounts = []
      } else {
        let alreadyUsed = false;
        for (let i = 0; i < accounts.accounts.length; i++) {
          if (accounts.accounts[i].username == data.username) {
            alreadyUsed = true;
          }
        }
        if (alreadyUsed) {
          accounts.accounts.push({ username: data.username, password: data.password });
        }
      }
      fs.writeFile('/tmp/accounts.json', JSON.stringify(accounts), 'utf8', (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`);
        } else {
          console.log(`File is written successfully!`);
          if (addedUser) return;
          state.loggedInUsers.push(data.username);
          addedUser = true;
          loggedIn = true;
          console.log('emitting login');
          socket.emit('login', { numUsers: state.loggedInUsers.length, messages: state.messageLog.slice(Math.max(state.messageLog.length - 100, 0)) });
        }
      });
    });
  });
});
