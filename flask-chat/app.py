from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, disconnect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

active_users = {}  # Maps request.sid to username

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('login')
def handle_login(username):
    if username in active_users.values():
        emit('login_failed', 'Username already in use')
        return
    active_users[request.sid] = username
    emit('login_success', username)
    emit('user_joined', f"{username} joined the chat", broadcast=True, include_self=False)
    print(f"{username} logged in")

@socketio.on('message')
def handle_message(msg):
    username = active_users.get(request.sid, 'Unknown')
    full_msg = f"{username}: {msg}"
    emit('message', full_msg, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    username = active_users.pop(request.sid, None)
    if username:
        emit('user_left', f"{username} left the chat", broadcast=True)
        print(f"{username} disconnected")

if __name__ == '__main__':
    # Important: host='0.0.0.0' makes it visible on LAN
    socketio.run(app, host='0.0.0.0', port=9987, debug=True)
