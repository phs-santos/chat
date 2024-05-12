// login elements
const login = document.querySelector('.login');
const loginForm = document.querySelector('.login__form');
const loginInput = document.querySelector('.login__input');

// chat elements
const chat = document.querySelector('.chat');
const chatMessages = document.querySelector('.chat__messages');
const chatForm = document.querySelector('.chat__form');
const chatInput = document.querySelector('.chat__input');


const user = {
    id: "",
    name: "",
    color: ""
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

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement('div');
    div.classList.add('message--self');
    div.innerHTML = content;
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

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);

    const message = userId === user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor);

    chatMessages.appendChild(message);

    scrollScreen();
}

const handleLogin = (e) => {
    e.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = 'none';
    chat.style.display = 'flex';

    websocket = new WebSocket(`ws://localhost:8080`);
    websocket.onmessage = processMessage
}

const sendMessage = (e) => {
    e.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    chatInput.value = '';
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)