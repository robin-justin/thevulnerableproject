const myForm = document.querySelector('#my-form');
const userList = document.querySelector('#users');

var data = ['Hide your heart','Still got the blues','Unchain my heart'];

document.getElementById("buhton").onclick = function() {master()};

function master(){
  function payload(data) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<Music>';

        for(i=0;i<data.length;i++) {
            var value = data[i];
            var tag = "Title";
            console.log(tag + " : " + value);

            xml += '<' + tag + '>' + value + '</' + tag + '>';
        }

        xml += '</Music>';
        return xml;
      }
    var passthistothebackend = payload(data);
    console.log(passthistothebackend);
    console.log("This actually works");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/xxe_present", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({passthistothebackend}));
    
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`${this.responseText}`));
                userList.appendChild(li);
            }
        };
        xmlhttp.open("GET", "/xxe/present_res", true);
        xmlhttp.send();
  }


    // Create new list item with user
    const li = document.createElement('li');

    // Add text node with input values
      /* li.appendChild(document.createTextNode(`${passthistothebackend}`)); */

    /* userList.appendChild(li); */ // Append to ul