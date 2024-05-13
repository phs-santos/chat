// login elements
const login = document.querySelector('.login');
const loginForm = document.querySelector('.login__form');
const loginInput = document.querySelector('.login__input');

// chat elements
const chat = document.querySelector('.chat');
const chatMessages = document.querySelector('.chat__messages');
const chatForm = document.querySelector('.chat__form');
const chatInput = document.querySelector('.chat__input');

// user data
const logged = document.querySelector('.logged__user');

// header elements
const headerLogout = document.querySelector('.header__logout');

let user = {
    id: "",
    name: "",
    color: ""
}

let websocket

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, type, users } = JSON.parse(data);

    console.log(data)

    if (type === 'login') {
        if (userId === user.id) {
            welcomeMessage(userName)
            return
        };

        userEntered(userName);
        return;
    }

    if (type === 'logout') {
        userLeft(userName);
        return;
    }

    if (type === 'users') {
        console.log(users)
        return;
    }

    const message = userId === user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor);
    chatMessages.appendChild(message);

    scrollScreen();
}

const createMessageSelfElement = (content) => {
    const div = document.createElement('div');
    const span = document.createElement('span');

    div.classList.add('message--self');
    span.classList.add('message--sender');

    div.appendChild(span);
    span.innerHTML = 'Você';

    div.innerHTML += content;
    return div;
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.classList.add('message--other');
    span.classList.add('message--sender');

    div.appendChild(span);
    span.innerHTML = sender;
    span.style.color = senderColor;

    div.innerHTML += content;
    return div;
}

let userStorage = JSON.parse(sessionStorage.getItem('user'));

if (userStorage) {
    user = userStorage;
    login.style.display = 'none';
    chat.style.display = 'flex';

    websocket = new WebSocket(`ws://localhost:8080`);
    // websocket = new WebSocket(`wss://chat-backend-ypyl.onrender.com`);
    websocket.onmessage = processMessage
}

const colors = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D'
]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

const userEntered = (userName) => {
    const span = document.createElement('span');
    span.classList.add('logged__user__name');
    span.innerHTML = `${userName} entrou na sala!`;
    logged.appendChild(span);
    logged.style.display = 'flex';
    setTimeout(() => {
        logged.style.display = 'none';
        logged.innerHTML = '';
    }, 3000)
}

const userLeft = (userName) => {
    const span = document.createElement('span');
    span.classList.add('logged__user__name');
    span.innerHTML = `${userName} saiu da sala!`;
    logged.appendChild(span);
    logged.style.display = 'flex';
    setTimeout(() => {
        logged.style.display = 'none';
        logged.innerHTML = '';
    }, 3000)
}

const welcomeMessage = (userName) => {
    const span = document.createElement('span');
    span.classList.add('logged__user__name');
    span.innerHTML = `Bem vindo ${userName}`;
    logged.appendChild(span);
    logged.style.display = 'flex';
    setTimeout(() => {
        logged.style.display = 'none';
        logged.innerHTML = '';
    }, 3000)
}

const handleLogin = (e) => {
    e.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = 'none';
    chat.style.display = 'flex';

    // websocket = new WebSocket(`ws://localhost:8080`);
    websocket = new WebSocket(`wss://chat-backend-ypyl.onrender.com`);

    websocket.onopen = () => {
        websocket.send(JSON.stringify({
            type: 'login',
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: 'Usuário entrou na sala!'
        }));
    }

    websocket.onmessage = processMessage

    sessionStorage.setItem('user', JSON.stringify(user));
}

const handleLogout = () => {
    sessionStorage.removeItem('user');
    sendClose();
    window.location.reload();
}

const sendMessage = (e) => {
    e.preventDefault();

    const message = {
        type: 'message',
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    chatInput.value = '';
}

const sendClose = () => {
    websocket.send(JSON.stringify({
        type: 'logout',
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: 'Usuário saiu da sala!'
    }))
}

loginForm.addEventListener('submit', handleLogin)
headerLogout.addEventListener('click', handleLogout)
chatForm.addEventListener('submit', sendMessage)