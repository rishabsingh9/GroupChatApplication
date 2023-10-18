
 
    var form = document.getElementById('form');
    form.addEventListener('submit', onsubmit);

    async function onsubmit(e) {
        e.preventDefault();
        let obj = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phonenumber:document.getElementById("phonenumber").value,
            password: document.getElementById("password").value
        }

        try{
            const response=await axios.post('http://localhost:3000/chatapp/user/sign-up', obj,{Credentials:"include"})
            alert("Signup Successfull");
        }
        catch(err){
            alert('email already exists');
                console.log(err);
        }
    }
    const existing=document.getElementById('existing');
    existing.addEventListener('click',()=>{
        window.location.href="/FrontEnd/login.html";
    })

    