const nextButton = document.getElementById("nextButton");
const newGroupContainer = document.getElementById("newGroupContainer");
const addUserSection = document.getElementById("adduser");

nextButton.addEventListener("click", async () => {
  newGroupContainer.style.display = "none"; // Hide the "New Group" section
  addUserSection.style.display = "block"; // Show the "Add Users" section
  const token=localStorage.getItem('token');

  try {
    console.log('anything');
    const response = await axios.get(
      `http://localhost:3000/chatapp/get-all-users`,{ headers: { "Authorization": token } }
    );
    let len = response.data.allusers.length;
    console.log("response",response.data.allusers);
    for (let i = 0; i < len; i++) {
      showAddUser(response.data.allusers[i]);
    }
    const adduser=document.getElementById('adduser');
    const createnow=document.createElement('button');
    createnow.classList.add('btn','btn-secondary');
    createnow.textContent='create now';
    adduser.appendChild(createnow);

        createnow.addEventListener('click',async()=>{
            var groupname = document.getElementById("groupname").value;
            let obj1={
                groupname:groupname
            }
            try {
                const response1 = await axios.post(
                    `http://localhost:3000/chatapp/add-group`,
                    obj1
                  );  


                  let groupId= response1.data.group.id;
                  let obj2={
                    groupId:groupId
                  }
                  const response2 = await axios.post(
                    `http://localhost:3000/chatapp/first-admin`,
                    obj2,{ headers: { "Authorization": token }}
                  ); 

                  const selectedUserIds = [];
                  selectedUserIds.length = 0; // Clear the array
                  const selectedCheckboxes = document.querySelectorAll(
                    ".user-checkbox:checked"
                  );
                  selectedCheckboxes.forEach((checkbox) => {
                    selectedUserIds.push(checkbox.value);
                  });
                  let obj3 = {
                    id: groupId,
                    selectedUserIds: selectedUserIds,
                  };

                  const response3 = await axios.post(
                    `http://localhost:3000/chatapp/add-group-users`,
                    obj3
                  );
                  localStorage.setItem("groupid", groupId);
                  window.location.href='/FrontEnd/chatapp.html'

            } catch (error) {
                console.log(error);
            }
        })

  } catch (err) {
    console.log(err);
  }
});

function showAddUser(user) {
    var adduser = document.getElementById("adduser");
    const div = document.createElement("div");
    div.className = "user-box"; // Apply the user-box class

    // Create a checkbox element and label for the user
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "user-checkbox";
    checkbox.value = user.id; // You can set the user's ID as the value
    checkbox.style.float = "right"; // Align checkboxes to the right

    const label = document.createElement("label");
    label.className = "user-name"; // Display user names as block elements
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(user.name)); // Display user's name

    div.appendChild(label);

    // Create the "Make Admin" button
    

    adduser.appendChild(div);
}


// var adduserbtn = document.getElementById("adduserbtn");
// adduserbtn.addEventListener("click", async () => {
//   try {
//     const response = await axios.get(
//       `http://localhost:3000/chatapp/get-all-users`
//     );
//     let len = response.data.allusers.length;
//     for (let i = 0; i < len; i++) {
//       showAddUser(response.data.allusers[i]);
//     }
//     var adduser = document.getElementById("adduser");
//     var btn = document.createElement("button");
//     btn.textContent = "Create Now";
//     adduser.appendChild(btn);

//     btn.addEventListener("click", async () => {
//       var groupname = document.getElementById("groupname").value;
//       console.log("groupname", groupname);
//       const selectedUserIds = [];
//       selectedUserIds.length = 0; // Clear the array
//       const selectedCheckboxes = document.querySelectorAll(
//         ".user-checkbox:checked"
//       );
//       selectedCheckboxes.forEach((checkbox) => {
//         selectedUserIds.push(checkbox.value);
//       });
//       let obj = {
//         groupname: groupname,
//         selectedUserIds: selectedUserIds,
//       };
//       try {
//         const response = await axios.post(
//           `http://localhost:3000/chatapp/add-group`,
//           obj
//         );
//         let id = response.data.group.id;
//         console.log("group id", id);
//         let obj2 = {
//           id: id,
//           selectedUserIds: selectedUserIds,
//         };
//         const response2 = await axios.post(
//           `http://localhost:3000/chatapp/add-group-users`,
//           obj2
//         );
//         console.log(response2.data.groupuser);
//         // await axios.get(`http://localhost:3000/chatapp/get-group-user/`)
//         localStorage.setItem("groupid", id);
       
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });


