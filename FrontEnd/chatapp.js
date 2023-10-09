var send=document.getElementById("send-button");

// send.addEventListener('click',async()=>{
//     var message=document.getElementById("message").value;
//     let obj={
//         message:message
//     }
//     console.log(message);
//     message='';
//     const token=localStorage.getItem('token');
//     try {
//         await axios.post('http://localhost:3000/chatapp/messages',obj,{headers:{"Authorization":token}})
//     } catch (error) {
//         console.log(error);
//     }
// })


send.addEventListener('click', async () => {
    var messageInput = document.getElementById("message");
    var message = messageInput.value;
    
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






