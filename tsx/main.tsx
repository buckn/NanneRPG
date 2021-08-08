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
    username: (document.getElementById('username') as HTMLInputElement).value,
    message: (document.getElementById('msgbx') as HTMLInputElement).value
  });
  state.messages.push({ username: "you", message: (document.getElementById('msgbx') as HTMLInputElement).value });
}

function login() {
  document.getElementById("overlay").style.display = "none";
  socket.emit('login user', {
    username: (document.getElementById('username') as HTMLInputElement).value,
    password: (document.getElementById('password') as HTMLInputElement).value
  });
  document.getElementById("overlay").style.display = "none";
  state.overlay = false;
}

function register() {
  socket.emit('register user', {
    username: (document.getElementById('username') as HTMLInputElement).value,
    password: (document.getElementById('password') as HTMLInputElement).value
  });
  document.getElementById("overlay").style.display = "none";
}

const contentDOM = document.getElementById('content');

let state = {
  messages: [],
  msg_num: 0,
  frame: 0,
  overlay: true
}

function page() {
  const content_shell = (
    <div>
      <div className={state.overlay ? "overlay" : null} id="overlay">
        <div className="loginprompt">
          <div className="box login">
            <input type="text" name="username" id="username" className="" placeholder="username"/>
            <input type="password" name="password" id="password" className="" placeholder="password"/>
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
          </div>
        </div>
      </div>
        <div className="msgarea">
        <ul id="messages" className="messages">
          {state.messages.map((message) => (
            <li key={message.username + message.message + state.msg_num.toString() + state.frame.toString() + state.messages.length.toString() + Math.random().toString()}>{message.username}: {message.message}</li>
          ))}
        </ul><br></br>
        <div className="messagebar"><label>Message:</label><input type="text" id="msgbx" name="name" size="10"></input><button id="msgbtn" onClick={send}>Send</button></div>
      </div>
    </div>);

  ReactDOM.render(content_shell, contentDOM);

  if (!state.overlay) {
    document.getElementById("overlay").style.display = "none";
  }

  state.frame++;
}

setInterval(page, 100);

//Function that logs
function log(textI: string) {
  state.messages.push({ username: "log", message: textI });
  state.msg_num++;
}
//Function that makes a sent message
function sent(userI: string, textI: string) {
  state.messages.push({ username: userI, message: textI });
  state.msg_num++;
}
//Function that makes a received message
function received(userI: string, textI: string) {
  if (userI == (document.getElementById('username') as HTMLInputElement).value) {
    return;
  }
  state.messages.push({ username: userI, message: textI });
  state.msg_num++;
}

// Whenever the server emits 'login', log the login message
socket.on('login', (data) => {
  // Display the welcome message
  log('Welcome!');
  log('There are ' + data.numUsers + ' Users!');
  state.overlay = false;

  console.log(data.messages);

  state.messages = data.messages.concat(state.messages);
});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', (data) => {
  received(data.username, data.message);
  console.log('message: ' + data.message)
});

socket.on('disconnect', () => {
  log('you have been disconnected');
});

socket.on('reconnect', () => {
  log('you have been reconnected');
  socket.emit('add user', (document.getElementById('username') as HTMLInputElement).value);
});

socket.on('reconnect_error', () => {
  log('attempt to reconnect has failed');
});