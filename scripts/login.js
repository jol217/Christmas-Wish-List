let uName = document.getElementById('uName');
let uPassword = document.getElementById('uPassword');

function handleLogin(){
    let nameStr = uName.value;
    let name = encodeURIComponent(uName.value);
    let password = encodeURIComponent(uPassword.value);
    let data;
    if(!nameStr.includes('@')){
        data = 'username=' + name + '&password=' + password;
    }
    else{
        data = 'email=' + name + '&password=' + password;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            console.log(xhttp.responseText);
            
            if(this.status == 200){
                alert("Login successful. Redirecting to homepage.");
                let sessTok = JSON.parse(xhttp.responseText);
                localStorage.setItem("sessTok", sessTok.id);
                localStorage.setItem("userName", nameStr);
                location.replace('index.html');
            }
            else if(this.status == 400){
                if(uName.value == "" && uPassword.value == ""){
                    alert("Enter a valid username and password.");
                }
                else{
                    alert("Enter a valid username.");
                }
            }
            else{
                if(uPassword.value == ""){
                    alert("Enter a valid password.");
                }
                else{
                    alert("Check username and password and try again.");
                }
            }
        }
    };
    xhttp.open("POST", "http://fa19server.appspot.com/api/Users/login", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
}
