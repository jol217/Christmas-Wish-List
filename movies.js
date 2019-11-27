var movies;                                           // Array of movies

// Initialize array if first visit
//if(localStorage.getItem("movieArr") === null){
if(1){
  movies = [];
  //["Star Wars", 1977, "PG"],
  //["The Empire Strikes Back", 1980, "PG"],
  //["The Revenge of the Jedi", 1983, "PG"]
  //];

// Else pull modified array
}else{
  movies = JSON.parse(localStorage.getItem("movieArr"));
}

// Get add movie modal HTML elements
var addMovie = document.getElementById("addMovie");
var addMovieD = document.getElementById("addMovieD");
var saveD = document.getElementById("saveD");
var cancelD = document.getElementById("cancelD");

// Get delete movie modal HTML elements
var deleteModal = document.getElementById("deleteModal");
var cancelDelete = document.getElementById("cancelDelete");

// Get edit movie modal HTML elements
var editMovieModal = document.getElementById("editMovieModal");
var cancelEditD = document.getElementById("cancelEditD");
var editMovieName = document.getElementById("eMName");
var editMovieYear = document.getElementById("eMYear");
var editMovieRating = document.getElementById("eMRating");

// Empty movie list paragraph
var noMovies = document.getElementById("noMovies");

// Get image for xmas item
var itmImage = document.getElementById("pic");

// Given array of ["NameOfMovie", yearReleased, "Rating"], make li and return (sans buttons)
function makeLi(movie){
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(movie[0]));
  li.appendChild(document.createTextNode(" ("));
  li.appendChild(document.createTextNode(movie[1]));
  li.appendChild(document.createTextNode(") - Rated: "));
  li.appendChild(document.createTextNode(movie[2]));
  var itemPic = document.createElement("IMG");
  itemPic.src = URL.createObjectURL(movie[3]);
  li.appendChild(itemPic);
  return li;
}

// Reads current js array, creates li for each element, creates edit & delete buttons and updates
function updateList(){
  var ul = document.getElementById('movieList');              // Unordered List
  ul.innerHTML="";                                            // Wipe List

  // Iterate through current array
  for( var i = 0; i < movies.length; i++){
    var movie = movies[i];                                   // Movie in array
    var li = makeLi(movie);                                  // Make li

    // Create edit button
    var edit = document.createElement('input');
    edit.type="button";
    edit.value = "Edit";
    edit.classList.add("mButton");
    edit.id= "e" + movie[0];                                // id flagged for movie

    // Make button show edit modal and create unique button for modal
    edit.addEventListener('click', function() {

      var uniqueEditBtn = document.createElement('input');  // Create button
      uniqueEditBtn.value = "Save";
      uniqueEditBtn.type = "button";
      uniqueEditBtn.id = this.id;

      // Button will find matching movie in Array, and change movie values
      uniqueEditBtn.addEventListener('click', function() {

        // Find movie index in arr, save in movieIdx
        var movieIdx = -1;
        for(var j = 0; j < movies.length; j++){
          var iMovie = movies[j];
          if(iMovie[0] == this.id.substring(1)){
            movieIdx = j;
          }
        }

        movies[movieIdx] = getEditMovie();        // Get values in input, update movie

        editMovieModal.close()                    // Close modal

        updateList();                             // Update list to match updated array

      });

      // Remove previous 'Save' button from modal, append new tagged 'Save' button
      editMovieModal.removeChild(editMovieModal.lastChild);
      editMovieModal.appendChild(uniqueEditBtn);


      var movieIdx = -1;
      for(var j = 0; j < movies.length; j++){
        var iMovie = movies[j];
        if(iMovie[0] == this.id.substring(1)){
          movieIdx = j;
        }
      }

      // Fill in input fields with un-edited movie
      editMovieName.value = movies[movieIdx][0]
      editMovieYear.value = movies[movieIdx][1]
      editMovieRating.value = movies[movieIdx][2]

      editMovieModal.showModal();                // Show modal
    });


    // Create delete button same logic as edit
    var delet = document.createElement('input');
    delet.type="button";
    delet.value = "Delete";
    delet.classList.add("mDButton");
    delet.id="d" + movie[0];


    delet.addEventListener("click", function() {

      var uniqueDeleteBtn = document.createElement('input');
      uniqueDeleteBtn.value = "Ok";
      uniqueDeleteBtn.type = "button";
      uniqueDeleteBtn.id = this.id;

      uniqueDeleteBtn.addEventListener('click', function() {
        var movieIdx = -1;

        for( var j = 0; j < movies.length; j++){
          var iMovie = movies[j];
          if(iMovie[0] == this.id.substring(1)){
            movieIdx = j;
          }
        }

        movies.splice(movieIdx, 1);              // Remove movie from array

        deleteModal.close();                     // Close delete modal

        updateList();                            // Update list to match updated array

      });

      deleteModal.removeChild(deleteModal.lastChild);
      deleteModal.appendChild(uniqueDeleteBtn);

      deleteModal.showModal();
    });

    li.appendChild(edit);                        // Append flagged edit button
    li.appendChild(delet);                       // Append flagged delete button

    // Prevent adding null li
    if( movies.length != 0){
      ul.appendChild(li);
    }

  }

  // Show no movies prompt if array empty
  if( movies.length == 0){
    noMovies.style.display = "inline";
  }else{
    noMovies.style.display = "none";
  }

  // Store updated array to local storage
  //localStorage.setItem("movieArr", JSON.stringify(movies));
}

// Purifies and makes movie array from add movie modal. Returns made movie
function getMovie(){
  var name = DOMPurify.sanitize(document.getElementById("mName").value);
  var year = DOMPurify.sanitize(document.getElementById("mYear").value);
  var rating = document.getElementById("mRating").value;
  var pic = document.getElementById("pic").files[0];
  var movie = [name, year, rating, pic];
  return movie;
}

// Purifies and makes movie array from edit movie modal. Returns made movie
function getEditMovie(){
  var name = DOMPurify.sanitize(document.getElementById("eMName").value);
  var year = DOMPurify.sanitize(document.getElementById("eMYear").value);
  var rating = document.getElementById("eMRating").value;
  var movie = [name, year, rating];
  return movie;
}

// Open add movie modal
addMovie.addEventListener('click', ()=> {
  addMovieD.showModal();
});

// Close add movie modal
cancelD.addEventListener('click', ()=>{
  addMovieD.close();
});

// Create new movie array, append to array of movies, update list
saveD.addEventListener('click', ()=> {
  var movie = getMovie();
//  var li = makeLi(movie);
//  var ul = document.getElementById('movieList');
  document.getElementById("mName").value = null;
  document.getElementById("mYear").value = null;
  document.getElementById("mRating").value = "G";
  movies.push(movie);
  updateList();
  addMovieD.close();
});

// Close delete movie modal
cancelDelete.addEventListener('click', ()=> {
  deleteModal.close();
});

// Close edit movie modal
cancelEditD.addEventListener('click', ()=> {
  editMovieModal.close();
});
