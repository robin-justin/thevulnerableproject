const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

let err = 0;
// Listening for form submittt
myForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault(); //to prevent default functionality of submit button

  // form validationzz
  if (nameInput.value === '' || emailInput.value === '')// substitute for alert('Please enter all fields')
  {
    msg.classList.add('error');  //calling that empty div msg, adding class name error
    msg.innerHTML = 'Please enter all fields';
    err = 1;

  } else { //undoing the error
    if (err === 1) {
      document.getElementsByClassName('error')[0].innerHTML = "";
      msg.classList.remove('error');
      err = 0;
    }
    // Create new list item with user
    const li = document.createElement('li');
    li.innerHTML = `${nameInput.value}: ${emailInput.value}`;
    userList.appendChild(li); // Append to ul

    // Clear fields for next submit
    nameInput.value = '';
    emailInput.value = '';
  }
}