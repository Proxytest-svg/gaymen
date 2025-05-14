const socket = io();

let currentUser = null;

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const loginError = document.getElementById('login-error');
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');

const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');
const messages = document.getElementById('messages');

// Handle login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('login', username);
  }
});

// Login success
socket.on('login_success', (username) => {
  currentUser = username;
  loginScreen.style.display = 'none';
  chatScreen.style.display = 'block';
});

// Login failure
socket.on('login_failed', (reason) => {
  loginError.textContent = reason;
});

// Handle sending messages
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (msgInput.value.trim()) {
    socket.emit('message', msgInput.value.trim());
    msgInput.value = '';
  }
});

// Handle receiving messages
socket.on('message', (msg) => {
  const item = document.createElement('div');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
