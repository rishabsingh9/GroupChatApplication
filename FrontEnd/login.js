var loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', login);


async function login(e) {
    let flag = false;
    e.preventDefault();
    let loginDetails = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
    try{
        const response=await axios.post('http://localhost:3000/expense/user/login',loginDetails)
        if(response.status==200){
            localStorage.setItem('token',response.data.token);
            window.location.href="/Front-End/expense.html";
            alert(response.data.message);
        }
        else{
            alert("User doesn't Exist")
         throw new Error(response.data.message);
        }
    }
    catch(err){  
        JSON.stringify(err);
        document.body.innerHTML=`<div style="color:red;">${err.message}</div>`
    }
}
const signup=document.getElementById('signup');
signup.addEventListener('click',()=>{
    window.location.href="/Front-End/signUp.html";
})
const forgot=document.getElementById("forgot");
forgot.addEventListener('click',()=>{
    window.location.href="/Front-End/forgot-password.html";
})