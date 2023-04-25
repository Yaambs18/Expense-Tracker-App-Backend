const myForm = document.querySelector('#expenses-form');
const expenseDesc = document.querySelector('#name');
const expenseAmount = document.querySelector('#amount');
const category = document.querySelector('#category');
const expenseList = document.querySelector('#expenseList');
const msg = document.querySelector('.msg');
const rowsSelection = document.getElementById('rows');

myForm.addEventListener('submit', onSubmit);

const token = localStorage.getItem('token');
const rows = localStorage.getItem('rows') || rowsSelection.value;

// retrieving stored expenses when DOM loads
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '../Login/login.html';
    }
    const parsedToken = parseJwt(token);

    if(parsedToken.isPremiumUser){
        showPremiumUser();
        showLeaderBoard();
    }
    
    axios.get(`https://expense-tracker-t2ho.onrender.com/expense?size=${rows}`, { headers: {'Authorization': token }})
    .then((response) => {
        for(expenseObj of response.data.expenses){
            showExpensesOnScreen(expenseObj);
        }
        pagination(response.data);
    })
    .catch(err => {
        myForm.innerHTML = '<h1>Error: Something went wrong!!!!</h1>';
        console.log(err);
    })
})

rowsSelection.addEventListener('change', () => {
    localStorage.setItem('rows', rowsSelection.value);
})

function pagination(resData) {
    const div = document.getElementById('pageButtons');
    div.innerHTML = '';
    if(resData.hasNextPage){
        const nxtBtn = document.createElement('button');
        nxtBtn.classList = 'float-end';
        nxtBtn.id = 'pageBtn';
        nxtBtn.textContent = resData.nextPage;
        div.appendChild(nxtBtn);
        nxtBtn.onclick = () => {
            axios.get(`https://expense-tracker-t2ho.onrender.com/expense?page=${nxtBtn.textContent}&size=${rows}`, { headers: {'Authorization': token }}).then((response) => {
                expenseList.innerHTML = "";
                for(expenseObj of response.data.expenses){
                    showExpensesOnScreen(expenseObj);
                }
                pagination(response.data);
            })
            .catch(err => {
                myForm.innerHTML = '<h1>Error: Something went wrong!!!!</h1>';
                console.log(err);
            })
        }
    }
    if(resData.hasPreviousPage){
        const prvBtn = document.createElement('button');
        prvBtn.id = 'pageBtn';
        prvBtn.textContent = resData.previousPage;
        div.appendChild(prvBtn);
        prvBtn.onclick = () => {
            axios.get(`https://expense-tracker-t2ho.onrender.com/expense?page=${prvBtn.textContent}&size=${rows}`, { headers: {'Authorization': token }}).then((response) => {
                expenseList.innerHTML = "";
                for(expenseObj of response.data.expenses){
                    showExpensesOnScreen(expenseObj);
                }
                pagination(response.data);
            })
            .catch(err => {
                myForm.innerHTML = '<h1>Error: Something went wrong!!!!</h1>';
                console.log(err);
            })
        }
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumUser(){
    document.getElementById('rzp-button1').style.display = 'none';
    document.getElementById('premiumUser').innerHTML = "You are a premium user ";
    document.getElementById('downloadReport').classList = 'btn btn-primary';
}

function onSubmit(e){
    e.preventDefault();
    if(expenseDesc.value === '' || expenseAmount.value === ''){
        msg.classList.add('error');
        msg.innerHTML = 'Please enter all fields';

        setTimeout(() => msg.remove(), 3000);
    }
    else{
        let expenseObj = {
            description : expenseDesc.value,
            amount : expenseAmount.value,
            category: category.value,
        }
        if(document.querySelector('#submitBtn').value === 'Update'){
            const expenseId = document.querySelector('#expenseId').value;
            axios
              .put('https://expense-tracker-t2ho.onrender.com/expense/'+expenseId, expenseObj, { headers: {'Authorization': token }})
              .then((response) => {
                showExpensesOnScreen(response.data.result);
              })
              .catch((err) => {
                document.body.innerHTML += "Error: Something went wrong!!!!";
                console.log(err);
              });

        }
        else{
            axios.post('https://expense-tracker-t2ho.onrender.com/expense/addExpense', expenseObj, { headers: {'Authorization': token }})
            .then((response) => {
                showExpensesOnScreen(response.data);
            })
            .catch(err => {
                document.body.innerHTML += 'Error: Something went wrong!!!!';
                console.log(err)
            });
        }
        expenseDesc.value = '';
        expenseAmount.value = '';
        category.value = '';
    }
}

function showExpensesOnScreen(obj){

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${obj.description} : ${obj.amount} : ${obj.category}`));

    // create delete btn element
    var delBtn = document.createElement('button');
    delBtn.className = 'delete';
    var delText = document.createTextNode('Delete');
    delBtn.appendChild(delText);

    // create edit btn element
    var edtBtn = document.createElement('button');
    edtBtn.className = 'edit';
    var edtText = document.createTextNode('Edit');
    edtBtn.appendChild(edtText);
    
    // delete event
    delBtn.onclick = () =>{
        if(confirm('Are you sure ?')){
            axios
              .delete("https://expense-tracker-t2ho.onrender.com/expense/" + obj._id, { headers: {'Authorization': localStorage.getItem('token') }})
              .then((response) => expenseList.removeChild(li))
              .catch((err) => console.log(err));
        }
    }

    // edit event
    edtBtn.onclick = () =>{
        expenseList.removeChild(li);
        expenseDesc.value = obj.description;
        expenseAmount.value = obj.amount;
        category.value = obj.category;
        const idElem = document.createElement('input');
        idElem.type = 'hidden';
        idElem.id = 'expenseId';
        idElem.value = obj._id;
        myForm.children[5].children[0].value = 'Update';
        myForm.appendChild(idElem);

    }
    
    li.appendChild(delBtn);
    li.appendChild(edtBtn);
    expenseList.appendChild(li);
}

function showLeaderBoard() {

    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('https://expense-tracker-t2ho.onrender.com/premium/leaderboard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)
        if(userLeaderBoardArray.data.length >0){
            document.getElementById("premiumUser").style.display = 'none';
        }

        var leaderboardElem = document.getElementById('leaderBoard');
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>';
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += (`<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenseAmount || 0} </li>`);
        })
    }
    document.getElementById("premiumUser").appendChild(inputElement);

}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://expense-tracker-t2ho.onrender.com/purchase/premiummembership', { headers: { 'Authorization': token }});
    console.log(response);
    var options = 
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const result = await axios.post('https://expense-tracker-t2ho.onrender.com/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {'Authorization': token } })
            
            alert('You are a Premium User Now');
            localStorage.setItem('token', result.data.token);
            
            showPremiumUser();
            showLeaderBoard();
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response){
        console.log(response);

        await axios.post('https://expense-tracker-t2ho.onrender.com/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {'Authorization': token } })

        alert('Something went wrong');
    })
}

downloadReport = async function (e) {
    try {
        const response = await axios.get('https://expense-tracker-t2ho.onrender.com/user/download', { headers: { 'Authorization': token }});

        if(response.status === 201){
            var a = document.createElement('a');
            a.href = response.data.fileUrl;
            a.download = 'expenseReport.csv';
            a.click();
        }
        else {
            throw new Error(response.data.message)
        }
    }
    catch (err) {
        alert(err);
    }
}

const logOutBtn = document.getElementById('logOut');

logOutBtn.addEventListener('click', async () => {
    localStorage.removeItem('token');
    window.location.href = '../Login/login.html';
});