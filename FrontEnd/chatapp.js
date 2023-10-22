// 
let selectedGroupElement;
var defaultGroupId;
const sendButton = document.getElementById("send-button");
let groupId;



sendButton.addEventListener('click',async()=>{
    const messageInput = document.getElementById("message");
    const message = messageInput.value;
    groupId=localStorage.getItem('groupid');
       
    let obj = {
        message: message,
        groupId:groupId,
    }
    messageInput.value = '';
    
    const token = localStorage.getItem('token');
    console.log(groupId);
    try {

        await axios.post(`http://localhost:3000/chatapp/messages`,obj, { headers: { "Authorization": token } })
    } catch (error) {
        console.log(error);
    }
});
// sendButton.addEventListener('click', () => {
//     const messageInput = document.getElementById('message');
//     const message = messageInput.value;
//     const groupId = localStorage.getItem('groupid');
  
//     const obj = {
//       message: message,
//       groupId: groupId,
//     };
  
//     messageInput.value = '';
  
//     const token = localStorage.getItem('token');
  
//     try {
//       // Send the message to the server via WebSocket
//       socket.emit('sendMessage', obj);
//     } catch (error) {
//       console.log(error);
//     }
//   });
  
//   // Receive messages from the server via WebSocket
//   socket.on('receiveMessage', (message) => {
//     // Display the received message in the chat interface
//     displayMessage(message.name, message.message);
//   });
// let chatMessages = [];

// // Define the maximum number of messages to keep
// const maxMessages = 20;

// // Function to add a new message to the chatMessages array and local storage
// function addMessageToStorage(message) {
//     chatMessages.push(message);

//     // Check if the number of messages exceeds the maximum limit
//     if (chatMessages.length > maxMessages) {
//         // Remove the oldest message(s) to maintain the limit
//         chatMessages.splice(0, chatMessages.length - maxMessages);
//     }

//     // Store the updated array of messages in local storage
//     localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
// }

// // Function to retrieve messages from local storage
// function getMessagesFromStorage() {
//     const storedMessages = localStorage.getItem('chatMessages');
//     if (storedMessages) {
//         chatMessages = JSON.parse(storedMessages);
//     }
// }

window.addEventListener('DOMContentLoaded', async () => {
    
    let groupId=localStorage.getItem('groupid');
    try {
        const token=localStorage.getItem('token');
        const response2=await axios.get(`http://localhost:3000/chatapp/get-groups`,{ headers: { "Authorization": token } });
        console.log("groups",response2.data.groups);
        if(response2){
        let len=response2.data.groups.length;
        for(let i=0;i<len;i++){
            console.log('showgroup function',response2.data);
            showGroups(response2.data.groups[i].groupname,response2.data.groups[i].id);
        } 
        fetchdata(groupId);
    }
    } catch (err) {
        console.log(err);
    }
    

})



async function fetchdata(groupId){
    const token = localStorage.getItem('token');
    try {
       
       // const response = await axios.get(`http://localhost:3000/chatapp/get-messages?lastMessageId=${lastMessageId}&groupId=${groupId}`, { headers: { "Authorization": token } });
        const response = await axios.get(`http://localhost:3000/chatapp/get-messages/${groupId}`, { headers: { "Authorization": token } })
        const users = await axios.get('http://localhost:3000/chatapp/get-users', { headers: { "Authorization": token } });
        if (groupId) {
            const response2 = await axios.get(`http://localhost:3000/chatapp/get-group/${groupId}`);
            console.log("response2.data.name.groupname)", response2.data.name.groupname);

            // Set the group name
            groupOnTop(response2.data.name.groupname);
        }
        console.log(users.data.namesArr);
        let len = response.data.messages.length;
        clearMessages();
        console.log("group msgs",response.data.messages);
      // clearMessages();
        console.log("len", len);
        for (let i = 0; i < len; i++) {
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



setInterval(() => {
   let groupId=localStorage.getItem('groupid')
    fetchdata(groupId); // Pass the function reference to setInterval
}, 1000);


// function displayMessage(name, message, messageClass) {
//     const messageContainer = document.getElementById('message-container');
//     const messageElement = document.createElement('div');
//     messageElement.className = `message ${messageClass}`;
//     messageElement.innerHTML = `<strong>${name}:</strong> ${message}`;
//     messageContainer.appendChild(messageElement);
//    // messageContainer.scrollTop = messageContainer.scrollHeight;
// }
function displayMessage(name, message, messageClass) {
  const messageContainer = document.getElementById('message-container');
  const messageElement = document.createElement('div');
  messageElement.className = `message ${messageClass}`;
  
  
  if (message.startsWith('http') || message.startsWith('https')) {
      
      const link = document.createElement('a');
      link.href = message;
      link.target = '_blank'; 
      link.textContent = message; 
      messageElement.innerHTML = `<strong>${name}:</strong> `;
      messageElement.appendChild(link);
  } else {
      // If it's not a URL, display it as regular text
      messageElement.innerHTML = `<strong>${name}:</strong> ${message}`;
  }

  messageContainer.appendChild(messageElement);
  // messageContainer.scrollTop = messageContainer.scrollHeight;
}


//groups
var createGroup=document.getElementById("creategroup");
createGroup.addEventListener('click',()=>{
    // var form=document.getElementById('groupform');
    // form.style.display="block";
   console.log('abc');
   window.location.href='/FrontEnd/new-group.html';
})





async function showGroups(name,groupId){
    var groupList=document.getElementById('group-list');
    const groupElement = document.createElement('div');
    groupElement.setAttribute('data-group-id', groupId); 
        groupElement.innerHTML =`<strong>${name}</strong>` ;
        groupElement.style.border = "1px solid #000";
        groupElement.classList.add('group-item');

        
    groupList.appendChild(groupElement);
    groupElement.addEventListener('click', async() => {
       
        selectedGroupElement = groupElement;
        const groupId = groupElement.getAttribute('data-group-id');
        localStorage.setItem("groupid",groupId);
        console.log("inshowgroups",groupId);
        defaultGroupId=groupId;
      clearMessages();
      console.log('hello');
    
   
      fetchdata(groupId);
    });
}

function clearMessages(){
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';
}

function groupOnTop(name) {
    console.log("calling", name);
    const gdiv = document.getElementById('groupnameontop');
    gdiv.innerHTML = ''; 
    const groupNameElement = document.createElement('div'); 
    groupNameElement.textContent = name; 
    const settingsbutton=document.createElement('button');
    settingsbutton.setAttribute('id','settingsbtn');
    settingsbutton.classList.add('group-settings-button');
    settingsbutton.textContent='Group Settings'
    groupNameElement.appendChild(settingsbutton);
    gdiv.appendChild(groupNameElement); 

    settingsbutton.addEventListener('click',()=>{
        window.location.href='/FrontEnd/updateGroup.html'
    })
}



let searchbtn = document.getElementById("search-button");
searchbtn.addEventListener('click', async () => {
    const input = document.getElementById("search-input").value;
    try {
        const response = await axios.get(`http://localhost:3000/chatapp/get-user?input=${input}`);
        console.log("after search", response);
        const searchdiv = document.getElementById("search-box");
        const div = document.createElement('div');
        div.innerHTML = `${response.data.user.name}<button id="add" type="button">Add User</button>`;
       

      
        const addButton = div.querySelector("#add");

       
        addButton.addEventListener("click", async function () {
            const groupId=localStorage.getItem("groupid");
            const userId=response.data.user.id;
            let obj={
                groupId:groupId,
                userId:userId
            }
            try {
                const response2 = await axios.post(`http://localhost:3000/chatapp/add-group-user`,obj); 
            } catch (err) {
                console.log(err);
            }
            
            
           
        });

        searchdiv.appendChild(div);

    } catch (err) {
       alert("user not found");
    }
});

const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
var filetype;

fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
         filetype = selectedFile.type;
        console.log(`File type: ${filetype}`);
    }
});

uploadButton.addEventListener("click", () => {
    const token=localStorage.getItem('token');
    console.log("token",token)
  const file =  fileInput.files[0]; // Get the selected file
  console.log('file',filetype);
  if (!file) {
    alert("Please select a file.");
    return;
  }

 
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type",filetype);
  let groupId=localStorage.getItem('groupid');

 
  axios.post(`http://localhost:3000/chatapp/upload`,formData,{ headers: { "Authorization": token, "Content-Type": "multipart/form-data" } })
    .then((data) => {
      if (data.data.success) {
        alert("File uploaded successfully.");
        
      } else {
        alert("File upload failed.");
      }
    })
    .catch((error) => {
      alert("An error occurred during the upload.");
      console.log("file", file);
      console.error(error);
    });
   
});

