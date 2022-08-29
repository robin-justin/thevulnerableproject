const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

let err = 0;
// Listening for form submittt
myForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();

  // form validationzz
  if (nameInput.value === '' || emailInput.value === '')// substitute for alert('Please enter all fields')
  {
    msg.classList.add('error');
    msg.innerHTML = 'Please enter all fields';
    err = 1;

  } else {
    if (err === 1) {
      document.getElementsByClassName('error')[0].innerHTML = "";
      msg.classList.remove('error');
      err = 0;
    }
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${nameInput.value}: ${emailInput.value}`));
    userList.appendChild(li); // Append to ul

    // Clear fields for next submit
    nameInput.value = '';
    emailInput.value = '';
  }
}