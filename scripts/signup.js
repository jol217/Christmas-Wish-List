
let uName = document.getElementById("uName");
let uEmail = document.getElementById("uEmail");
let uPassword = document.getElementById("uPassword");
let uConfirmPassword = document.getElementById("uConfirmPassword");

function handleSignUp(){
    if(uName.value == "" || uEmail.value == "" || uPassword.value == "" || uConfirmPassword == ""){
        alert("Ensure all fields are filled. Try again.");
        return;
    }
    else if(uPassword.value != uConfirmPassword.value){
        alert("Password you entered does not match. Please try again.");
        return;
    }
    let name = encodeURIComponent(uName.value);
    let email = encodeURIComponent(uEmail.value);
    let password = encodeURIComponent(uPassword.value);
    let data = 'username=' + name + '&email=' + email + '&password=' + password;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            console.log(xhttp.responseText);
            if(this.status == 200){
                alert("Sign up successful. Redirecting to login page.");
                location.replace('login.html');
            }
            else{
                let errormsg = "";
                let response = JSON.parse(xhttp.responseText);
                let error = response.error.details.messages;
                for(let key in error){
                    if(error.hasOwnProperty(key)){
                        if(key == "username"){
                            errormsg += error[key] + "\n";
                        }
                        if(key == "email"){
                            if(error[key] == "is invalid"){
                                errormsg += "Email is invalid \n";
                            }
                            else{
                                errormsg += error[key] + "\n";
                            }
                        }
                    }
                }
                alert(errormsg);
            }
        }
    };
    xhttp.open("POST", "http://fa19server.appspot.com/api/Users", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
}
