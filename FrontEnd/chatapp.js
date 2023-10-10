// 

const sendButton = document.getElementById("send-button");

sendButton.addEventListener('click', async () => {
    const messageInput = document.getElementById("message");
    const message = messageInput.value;

    let obj = {
        message: message
    }

    console.log(message);

    messageInput.value = '';

    const token = localStorage.getItem('token');
    try {
        await axios.post('http://localhost:3000/chatapp/messages', obj, { headers: { "Authorization": token } })
    } catch (error) {
        console.log(error);
    }
})

let chatMessages = [];

// Define the maximum number of messages to keep
const maxMessages = 20;

// Function to add a new message to the chatMessages array and local storage
function addMessageToStorage(message) {
    chatMessages.push(message);

    // Check if the number of messages exceeds the maximum limit
    if (chatMessages.length > maxMessages) {
        // Remove the oldest message(s) to maintain the limit
        chatMessages.splice(0, chatMessages.length - maxMessages);
    }

    // Store the updated array of messages in local storage
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}

// Function to retrieve messages from local storage
function getMessagesFromStorage() {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
        chatMessages = JSON.parse(storedMessages);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    getMessagesFromStorage();
    // Display messages from chatMessages array
    chatMessages.forEach(async(message) => {
        let id=message.userId;
        const response=await axios.get(`http://localhost:3000/chatapp/get-user/${id}`)
        displayMessage(response.data.user.name, message.message, message.messageClass);
    });
})

function displayMessage(name, message) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<strong>${name}:</strong> ${message}`;
    messageContainer.appendChild(messageElement);
}


// window.addEventListener('DOMContentLoaded', async () => {
//     const token = localStorage.getItem('token');
//     try {
//         const response = await axios.get('http://localhost:3000/chatapp/get-messages', { headers: { "Authorization": token } });
//         const users = await axios.get('http://localhost:3000/chatapp/get-users', { headers: { "Authorization": token } });
//         console.log(users.data.namesArr);
//         let len = response.data.messages.length;
//         console.log("len", len);
//         for (let i = 0; i < len; i++) {
//             console.log(response.data.messages[i])
//             const userId = response.data.messages[i].userId;
//             console.log('userid', userId);
//             let name = users.data.namesArr[userId];
            
//             if (userId === Number(users.data.namesArr[0])) {
//                 name = "You";
//                 displayMessage(name, response.data.messages[i].message, 'your-message');
//             } else {
//                 displayMessage(name, response.data.messages[i].message, 'other-message');
//             }
//         }
//     } catch (err) {
//         console.log(err);
//     }
// })
async function fetchdata(){
    const lastMessageId = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].id : null;
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:3000/chatapp/get-messages?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token } });
        const users = await axios.get('http://localhost:3000/chatapp/get-users', { headers: { "Authorization": token } });
        console.log(users.data.namesArr);
        let len = response.data.messages.length;
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = '';
        console.log("len", len);
        for (let i = 0; i < len; i++) {
            addMessageToStorage(response.data.messages[i]);
            console.log(response.data.messages[i])
            const userId = response.data.messages[i].userId;
            console.log('userid', userId);
            let name = users.data.namesArr[userId];
            
            // Clear the chat container before displaying new messages
            


            if (userId === Number(users.data.namesArr[0])) {
                name = "You";
                displayMessage(name, response.data.messages[i].message, 'your-message');
            } else {
                displayMessage(name, response.data.messages[i].message, 'other-message');
            }
        }
    } catch (err) {
        console.log(err);
    }
}

setInterval(fetchdata, 1000);



function displayMessage(name, message, messageClass) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageClass}`;
    messageElement.innerHTML = `<strong>${name}:</strong> ${message}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
fetchdata();