const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#username');
const emailInput = document.querySelector('#password');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

let err = 0;
// Listening for form submittt
myForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
 /*  e.preventDefault(); */ //to prevent default functionality of submit button

  // form validationzz
  if (nameInput.value === '' || emailInput.value === '')// substitute for alert('Please enter all fields')
  {
    msg.classList.add('error');  //calling that empty div msg, adding class name error
    msg.innerHTML = 'Please enter all fields';
    err = 1;

  } else { 
    if (err === 1) {
      document.getElementsByClassName('error')[0].innerHTML = "";
      msg.classList.remove('error');
      err = 0;
    }
  }
}