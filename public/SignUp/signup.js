const signUpForm  = document.querySelector('#signup-form');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

signUpForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    let userObj = {
        name: name.value,
        email: email.value,
        password: password.value
    };
    try{
        const res = await axios.post('http://localhost:3000/user/signup', userObj);
        if(res.status === 201){
            console.log(res);
            window.location.href = '../Login/login.html';
        }
        else{
            throw new Error(res.status);
        }
    }
    catch(error) {
        document.body.innerHTML += `<h1>Error: Request Failed with status code ${error}</h1>`;
        console.log(err);
    }
}