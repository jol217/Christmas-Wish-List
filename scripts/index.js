// Global variables: Access token and all dynamic page elements.
let accessTok;
let userName = localStorage.getItem("userName");
document.getElementById("welcome").innerHTML += userName + "!";


let CLOUDINARY_URL =	'https://api.cloudinary.com/v1_1/djrkf1kiy/image/upload';
let CLOUDINARY_PRESET = 'mlqqwc0u';

let addModal    = document.getElementById("addModal");
let openAdd     = document.getElementById("openAdd");
let cancelAdd   = document.getElementById("cancelAdd");
let saveNewItem = document.getElementById("saveNewItem");

let editModal    = document.getElementById("editModal");
let editName     = document.getElementById("editName");
let editPrice    = document.getElementById("editPrice");
let editCategory = document.getElementById("editCategory");
let editPic      = document.getElementById("editPic");
let editComment  = document.getElementById("editComment");
let cancelEdit   = document.getElementById("cancelEdit");
let editRating   = document.getElementById("editRating");

let deleteModal = document.getElementById("deleteModal");
let cancelDelete = document.getElementById("cancelDelete");

let addName     = document.getElementById("addName");
let addPrice    = document.getElementById("addPrice");
let addCategory = document.getElementById("addCategory");
let addPic      = document.getElementById("addPic");
let addComment  = document.getElementById("addComment");
let addRating   = document.getElementById("addRating");

// On load, get user wishlist through API request
function getWishList(callback){

    if(localStorage.getItem("sessTok") === null){
        console.log("hit");
        location.replace('login.html');
    }
    accessTok = localStorage.getItem("sessTok");
    console.log(accessTok);

    let wishList;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            wishList = JSON.parse(xhttp.responseText);
            callback(wishList);
        }
    }

    xhttp.open("GET", "http://fa19server.appspot.com/api/wishlists/myWishList?access_token="+accessTok);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send();
}

// After successful request initialize homepage w/ user wishlist
function loadHomepage(wishList){
    console.log("Loaded Homepage");
    console.log(wishList);
    updateList(wishList.wishItems);
}

// Populate page list with wishlist items
function updateList(wishList){
  let ul = document.getElementById("wList");
  ul.innerHTML="";


  for( let i = 0; i < wishList.length; i++ ){
    console.log("in");
    let item = wishList[i];
    let li = makeLi(item);

    // Create & append edite

    let editBtn = document.createElement("input");
    editBtn.type = "button";
    editBtn.value = "edit"
    editBtn.id = "e" + item.id;

    editBtn.addEventListener('click', function(){
      let itemRating = item.comment.substring(item.comment.length - 5,item.comment.length - 4 );
      let confirmEdit = document.createElement("input");
      confirmEdit.type = "button";
      confirmEdit.value = "Save changes";
      confirmEdit.id = this.id;

      confirmEdit.addEventListener('click', function(){
          let itemId = this.id.substring(1);

          if (editPic.value != ""){
            let xhttp = new XMLHttpRequest();
            var formData = new FormData();
            xhttp.open("POST", CLOUDINARY_URL, true);
            xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            let pic = editPic.files[0];

            formData.append('upload_preset', CLOUDINARY_PRESET);
            formData.append('file', pic);

            xhttp.upload.addEventListener("progress", function(e) {
                var progress = Math.round((e.loaded * 100.0) / e.total);
                document.getElementById('progress').style.display = "block";
                document.getElementById('pTitle').style.display="block";
                document.getElementById('progress').style.width = progress + "%";


                console.log(`fileuploadprogress data.loaded: ${e.loaded}, data.total: ${e.total}`);
            });

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4){
                    document.getElementById('progress').style.display = "none";
                    document.getElementById('pTitle').style.display="none";
                    console.log(xhttp.responseText);
                    let response = JSON.parse(xhttp.responseText);
                    console.log(response);
                    let picURL = response.url;

                    var xhttp2 = new XMLHttpRequest();

                    let eName  = encodeURIComponent(DOMPurify.sanitize(editName.value));
                    let ePrice = editPrice.value;
                    let eCategory = encodeURIComponent(DOMPurify.sanitize(editCategory.value));
                    let ePic   = picURL;
                    let eComment = editComment.value;
                    let eRating = editRating.value;

                    let data = "item=" + eName + "&price=" + ePrice + "&category=" + eCategory + "&image=" + ePic + "&comment=" + eComment +encodeRating(eRating);

                    xhttp2.onreadystatechange = function(){
                      if(this.readyState == 4){
                        console.log(xhttp.responseText);
                        editModal.close();
                        getWishList(loadHomepage);
                      }
                    }
                    xhttp2.open("POST", "http://fa19server.appspot.com/api/wishlists/" + itemId + "/replace?access_token=" + accessTok);
                    xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp2.send(data);

                }
            }

            xhttp.send(formData);

          }else{
            var xhttp2 = new XMLHttpRequest();

            let eName  = encodeURIComponent(DOMPurify.sanitize(editName.value));
            let ePrice = editPrice.value;
            let eCategory = encodeURIComponent(DOMPurify.sanitize(editCategory.value));
            let ePic   = item.image;
            let eComment = editComment.value;
            let eRating = editRating.value;

            let data = "item=" + eName + "&price=" + ePrice + "&category=" + eCategory + "&image=" + ePic + "&comment=" + eComment +encodeRating(eRating);

            xhttp2.onreadystatechange = function(){
              if(this.readyState == 4){
                console.log(xhttp2.responseText);
                editModal.close();
                getWishList(loadHomepage);
              }
            }
            xhttp2.open("POST", "http://fa19server.appspot.com/api/wishlists/" + itemId + "/replace?access_token=" + accessTok);
            xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp2.send(data);
          }
      });
      editName.value = item.item;
      editPrice.value = item.price;
      editCategory.value = item.category;
      editPic.value = "";
      editComment.value = item.comment.substring(0,item.comment.indexOf("<p"));
      editRating.value = parseInt(itemRating,10);
      editModal.removeChild(editModal.lastChild);
      editModal.appendChild(confirmEdit);
      editModal.showModal();
    });

    let deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "delete";
    deleteBtn.id = "d" + item.id;

    deleteBtn.addEventListener('click', function(){
      let confirmDelete = document.createElement("input");
      confirmDelete.type = "button";
      confirmDelete.value = "Ok";
      confirmDelete.id = this.id;

      confirmDelete.addEventListener('click', function(){
          let itemId = this.id.substring(1);
          var xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function(){
              if(this.readyState == 4){
                  console.log(xhttp.responseText);
                  deleteModal.close();
                  getWishList(loadHomepage);
              }
          };

          xhttp.open("DELETE", "http://fa19server.appspot.com/api/wishlists/" + itemId + "?access_token=" + accessTok, true);
          xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhttp.send();

      });

      deleteModal.removeChild(deleteModal.lastChild);
      deleteModal.appendChild(confirmDelete);
      deleteModal.showModal();
    });

    setTimeout(function(){
      li.appendChild(deleteBtn);
      li.appendChild(editBtn);
    }, 300);

    ul.appendChild(li);
    ul.appendChild(document.createElement("br"));
  }
}

// From an Item, create and return a representative li html element
function makeLi(item){
  let itemRating = item.comment.substring(item.comment.length - 5,item.comment.length - 4 );
  let li = document.createElement("li");
  let itemPic = document.createElement("IMG");
  itemPic.src = item.image;
  itemPic.style = "width:200px; height:200px";


  li.appendChild(itemPic);
  li.appendChild(document.createElement("br"));

  let stars = addStars(parseInt(itemRating,10));
  li.appendChild(stars);

  li.appendChild(document.createTextNode(item.item));
  li.appendChild(document.createElement("br"));
  li.appendChild(document.createElement("hr"));

  li.appendChild(document.createTextNode("Price: $ "));
  li.appendChild(document.createTextNode(item.price.toFixed(2)));
  li.appendChild(document.createElement("br"));

  li.appendChild(document.createTextNode("Category: "));
  li.appendChild(document.createTextNode(item.category));
  li.appendChild(document.createElement("br"));

  li.appendChild(document.createTextNode("Comments:"));
  li.appendChild(document.createElement("br"));
  li.innerHTML+=item.comment;
  li.appendChild(document.createElement("br"));


  return li;
}

// On logout btn click, request logout and redirect
function handleLogOut(){
    var xhttp = new XMLHttpRequest();
    let token = localStorage.getItem("sessTok");

    // Callback
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 204){
            localStorage.setItem("sessTok", null);
            localStorage.setItem("userName", null);
            location.replace('login.html');
        }
    };

    xhttp.open("POST", "http://fa19server.appspot.com/api/Users/logout?access_token=" + token, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send();
}

// Save a new item to backend, update list on success.
saveNewItem.addEventListener('click', ()=> {

    // Ensure all fields are filled
    if( addName.value    == "" || addCategory.value == "" ||
        addComment.value == "" || addPic.value == "" ){
        alert("Ensure all fields are filled. Try again.");
        return;
    }

    // Start request to cloudinary for image upload
    let xhttp = new XMLHttpRequest();
    let pic = addPic.files[0];

    let formData = new FormData();
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('file', pic);

    // Visual progress update on cloudinary upload
    xhttp.upload.addEventListener("progress", function(e) {
        var progress = Math.round((e.loaded * 100.0) / e.total);
        document.getElementById('progress').style.display = "block";
        document.getElementById('pTitle').style.display="block";
        document.getElementById('progress').style.width = progress + "%";
        console.log(`IMG| data.loaded: ${e.loaded}, data.total: ${e.total}`);
    });

    // Callback
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            document.getElementById('progress').style.display = "none";
            document.getElementById('pTitle').style.display="none";
            let response = JSON.parse(xhttp.responseText);
            let picURL = response.url;
            uploadToBackend(picURL);            // Upload item to api
        }
    }

    // Open connection, set headers, send request
    xhttp.open("POST", CLOUDINARY_URL, true);
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhttp.send(formData);

});

// Open add item modal
openAdd.addEventListener('click', ()=> {
    addModal.showModal();
});

// Cancel add item
cancelAdd.addEventListener('click', ()=> {
    addModal.close();
});

// Cancel delete
cancelDelete.addEventListener('click', ()=> {
    deleteModal.close();
});

// Cancel edit
cancelEdit.addEventListener('click', ()=>{
    editModal.close();
});

// Upload item to api
function uploadToBackend(picURL){
    var xhttp = new XMLHttpRequest();

    let newAddName     = encodeURIComponent(DOMPurify.sanitize(addName.value));
    let newAddPrice    = addPrice.value;
    let newAddCategory = encodeURIComponent(DOMPurify.sanitize(addCategory.value));
    let newAddImage    = picURL;
    let newAddComment  = encodeURIComponent(DOMPurify.sanitize(addComment.value));
    let newAddRating   = addRating.value;

    let data = 'item='      + newAddName +
               '&price='    + newAddPrice +
               '&category=' + newAddCategory +
               '&image='    + newAddImage    +
               '&comment='  + newAddComment+encodeRating(newAddRating);

    // Callback
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            console.log(xhttp.responseText);
            getWishList(loadHomepage);
        }
    };

    console.log(accessTok);

    xhttp.open("POST", "http://fa19server.appspot.com/api/wishlists?access_token=" + accessTok, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);

    addModal.close();                                      // Close modal

    // Reset modal input values for next modal open
    addName.value     = "";
    addPrice.value    = 0;
    addCategory.value = "";
    addPic.value      = "";
    addComment.value  = "";
}

// Create and return star rating span with numStar amount of stars filled.
function addStars(numStar){
    let div = document.createElement("div");

    for(let i = 0; i < numStar; i++){

        let star = document.createElement("span");
        star.className = "fa fa-star checked";
        console.log(star.class);
        div.appendChild(star);
    }

    let noStar = 5 -numStar;
    for(let i = 0; i < noStar; i++){
        let xStar = document.createElement("span");
        xStar.className = "fa fa-star";
        div.appendChild(xStar);
    }
    return div;
}

// Encode number into a p element that does not display
function encodeRating(rating){
    let encode = "<p style='display:none'>" +rating+ "</p>";
    return encode;
}
