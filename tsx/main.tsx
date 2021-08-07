import io from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";

console.log('TS hello world!');

/* 
    react components 
*/

const socket = io();

function send() {
  socket.emit('new message', {
    username: (document.getElementById('name') as HTMLInputElement).value,
    message: (document.getElementById('msgbx') as HTMLInputElement).value
  });
  state.messages.push({ user: "you", text: (document.getElementById('msgbx') as HTMLInputElement).value });
}

const contentDOM = document.getElementById('content');

let state = {
  messages: []
}

function page() {
  const content_shell = (
  <div className="msgarea">
    <label>Name:</label><input type="text" id="name" name="name" size="10"></input><br></br>
    <ul id="messages">
      {state.messages.map((message) => (
          <li>{message.user}: {message.text}</li>
        ))}
    </ul><br></br>
    <label>Message:</label><input type="text" id="msgbx" name="name" size="10"></input><button id="msgbtn" onClick={send}>Send Message</button>
  </div>);

  ReactDOM.render(content_shell, contentDOM);
}

setInterval(page, 100);

//Function that logs
function log(textI: string) {
  state.messages.push({ user: "log", text: textI });
}
//Function that makes a sent message
function sent(userI: string, textI: string) {
  state.messages.push({ user: userI, text: textI });
}
//Function that makes a received message
function received(userI: string, textI: string) {
  if (userI == (document.getElementById('name') as HTMLInputElement).value) {
    return;
  }
  state.messages.push({ user: userI, text: textI });
}

// Whenever the server emits 'login', log the login message
  socket.on('login', (data) => {
    // Display the welcome message
    log('Welcome!');
    log('There are ' + data.numUsers + 'users!');
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    received(data.username, data.message);
    console.log('message: ' + data.message)
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    log(data.username + ' joined');
    log('There are ' + data.numUsers + 'users!');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    log(data.username + ' left');
    log('There are ' + data.numUsers + 'users!');
  });

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    log('you have been reconnected');
    socket.emit('add user', (document.getElementById('name') as HTMLInputElement).value);
  });

  socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
  });