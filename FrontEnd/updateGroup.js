
window.addEventListener('DOMContentLoaded',async()=>{
    const token=localStorage.getItem('token');
    try {
        const response = await axios.get(
            `http://localhost:3000/chatapp/get-all-users`,{ headers: { "Authorization": token } }
          );
          let len = response.data.allusers.length;
          console.log("response",response.data.allusers);
          
          const groupId=localStorage.getItem('groupid');
        
            
          for (let i = 0; i < len; i++) {
            const userId=response.data.allusers[i].id;
            const response2=  await axios.get(
                `http://localhost:3000/chatapp/get-group-user?userId=${userId}&groupId=${groupId}`);
               
            showUpdateUser(response.data.allusers[i],response2.data.message,response2.data.groupuser);
            console.log('here',response2.data)
          }
    } catch (error) {
        console.log(error);
    }
   
})

function showUpdateUser(user,message,groupuser){
    let flag=false;
    const groupId=localStorage.getItem("groupid");
    const userId=user.id;
    let obj={
        groupId:groupId,
        userId:userId
    }
    var adduser = document.getElementById("adduser");
    const div = document.createElement("div");
    div.className = "user-box"; // Apply the user-box class

    // Create a checkbox element and label for the user
    

    const label = document.createElement("label");
    label.className = "user-name"; // Display user names as block elements
    const admin=document.createElement('button');
    console.log('message',message);
   
    if(message==='true'){   
        label.appendChild(document.createTextNode(user.name));
        const Remove=document.createElement('button');
        Remove.classList.add('btn','btn-primary');
        Remove.textContent='Remove';
        const admin=document.createElement('button');
        admin.textContent='Make Admin'
        admin.classList.add('btn','btn-success');
        
    
         
        // label.appendChild(document.createTextNode(user.name)); // Display user's name
            label.appendChild(admin);
        
        label.appendChild(Remove);
    
        div.appendChild(label);
        adduser.appendChild(div);
   
    admin.addEventListener('click',async()=>{
        console.log('id',obj.userId,"grou[id",obj.groupId);
        try {
          const resp=  await axios.post(`http://localhost:3000/chatapp/make-admin`,obj);
          location.reload();
          console.log(resp);
        } catch (err) {
            console.log(err);
        }
    })
    Remove.addEventListener('click',async()=>{
        try {
            await axios.post(`http://localhost:3000/chatapp/remove-group-user`,obj); 
            location.reload(); 
        } catch (err) {
            console.log(err);
        }
         
    })

    
    }
    else{
        
    const Add=document.createElement('button');
    Add.classList.add('btn','btn-primary');
    Add.textContent='Add';

    label.appendChild(document.createTextNode(user.name)); // Display user's name
    
    label.appendChild(Add);

    div.appendChild(label);
    adduser.appendChild(div);

    Add.addEventListener('click',async()=>{
       
      
    try {
        const response2 = await axios.post(`http://localhost:3000/chatapp/add-group-user`,obj); 
        location.reload();
    } catch (err) {
        console.log(err);
    }
        
    })
    } 
   
}
