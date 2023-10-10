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

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/chatapp/get-messages', { headers: { "Authorization": token } });
        const users = await axios.get('http://localhost:3000/chatapp/get-users', { headers: { "Authorization": token } });
        console.log(users.data.namesArr);
        let len = response.data.messages.length;
        console.log("len", len);
        for (let i = 0; i < len; i++) {
            console.log(response.data.messages[i])
            const userId = response.data.messages[i].userId;
            console.log('userid', userId);
            let name=users.data.namesArr[userId];
            if(userId==Number(users.data.namesArr[0])){
                name="You"
            }
            displayMessage(name, response.data.messages[i].message);
        }
    } catch (err) {
        console.log(err);
    }
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
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/chatapp/get-messages', { headers: { "Authorization": token } });
        const users = await axios.get('http://localhost:3000/chatapp/get-users', { headers: { "Authorization": token } });
        console.log(users.data.namesArr);
        let len = response.data.messages.length;
        console.log("len", len);
        for (let i = 0; i < len; i++) {
            console.log(response.data.messages[i])
            const userId = response.data.messages[i].userId;
            console.log('userid', userId);
            let name = users.data.namesArr[userId];
            
            
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
}
fetchdata();