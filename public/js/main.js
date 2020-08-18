const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// get username and room from url
const { username, room, roomKey } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// creating protected rooms
const protectedRooms = [
    {
      roomName: "adminChat",
      roomPwd: "EsTisMANCiRairISomPL",
    },
    {
      roomName: "friendsChat",
      roomPwd: "EDgentISMutEiGArveRS",
    },
  ];

  

// declare variable to check if the room is protected
let protected = false;
let roomIndex;

for(let i = 0; i < protectedRooms.length; i++) {
    // check if room is protected
    if(protectedRooms[i]['roomName'] === room) {
        protected = true;
        roomIndex = i;
    }
}

if(protected === true) {
    if(roomKey == '' && roomKey == undefined) {
        console.log('You have not entered a room key!')
        window.location.href = '../index-advanced.html'
        throw new Error("Wrong password!")
    } else {
        if(roomKey === protectedRooms[roomIndex]['roomPwd']) {
            console.log('You have entered the right room key!')
        } else {
            console.log('You have entered the wrong room key!')
            window.location.href = '../index-advanced.html'
            throw new Error("Wrong password!")
        }
    }
} else {
    console.log('This is NOT a protected room')
}

const socket = io()

// join chatroom
socket.emit('joinRoom', { username, room })

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

// when a message gets recieved from the server 
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// message submit
chatForm.addEventListener('submit', e => {
    // prevent form from submitting to a file
    e.preventDefault()

    // get message text
    const msg = e.target.elements.msg.value

    // emit a message to the server
    socket.emit('chatMessage', msg)

    //clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// output message to DOM
const outputMessage = (message) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// add room name to DOM
const outputRoomName = room => {
    roomName.innerText = room;
}

// add users to DOM
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}