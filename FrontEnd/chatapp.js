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
    
    try {
        const token=localStorage.getItem('token');
        const response2=await axios.get(`http://localhost:3000/chatapp/get-groups`,{ headers: { "Authorization": token } });
        console.log("groups",response2.data.groups);
        let len=response2.data.groups.length;
        for(let i=0;i<len;i++){
            showGroups(response2.data.groups[i].groupname);
        } 
    } catch (err) {
        console.log(err);
    }
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
            addMessageToStorage(response.data.messages[i].message);
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
   // messageContainer.scrollTop = messageContainer.scrollHeight;
}
fetchdata();


//groups
var createGroup=document.getElementById("creategroup");
createGroup.addEventListener('click',()=>{
    var form=document.getElementById('groupform');
    form.style.display="block";
})

var adduserbtn=document.getElementById("adduserbtn");
adduserbtn.addEventListener('click',async()=>{
try {
   const response=await axios.get(`http://localhost:3000/chatapp/get-all-users`);
   let len=response.data.allusers.length;
   for(let i=0;i<len;i++){
    showAddUser(response.data.allusers[i]);
   }
   var adduser=document.getElementById('adduser');
   var btn=document.createElement('button');
   btn.textContent='Create Now';
   adduser.appendChild(btn);

   btn.addEventListener('click',async()=>{
    var groupname=document.getElementById("groupname").value;
    const selectedUserIds = [];
    selectedUserIds.length = 0; // Clear the array
    const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
    selectedCheckboxes.forEach((checkbox) => {
        selectedUserIds.push(checkbox.value);
    });
    let obj={
        groupname:groupname,
        selectedUserIds:selectedUserIds
    }
    try {
      const response=  await axios.post(`http://localhost:3000/chatapp/add-group`,obj);
      let id=response.data.group.id;
      console.log("group id",id);
      let obj2={
        id:id,
        selectedUserIds:selectedUserIds
    }
      const response2=  await axios.post(`http://localhost:3000/chatapp/add-group-users`,obj2); 
        console.log(response2.data.groupuser);
    await axios.get(`http://localhost:3000/chatapp/get-group-user/`)
    } catch (err) {
        console.log(err);
    }
   })

} catch (err) {
    console.log(err);
}
})

function showAddUser(user) {
    var adduser = document.getElementById('adduser');
    const div = document.createElement('div');
    
    // Create a checkbox element and label for the user
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'user-checkbox';
    checkbox.value = user.id; // You can set the user's ID as the value
    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(user.name)); // Display user's name
    
    div.appendChild(label);
    adduser.appendChild(div);
}

function showGroups(name){
    var groupList=document.getElementById('group-list');
    const groupElement = document.createElement('div');
        groupElement.innerHTML =`${name}` ;
    groupList.appendChild(groupElement);
}