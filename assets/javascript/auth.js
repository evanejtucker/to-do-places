$( document ).ready(function() {

	var config = {
		   apiKey: "AIzaSyDaDxv9jNfNhEd7stk340f8FJqDo7iOtSg",
		   authDomain: "to-do-places.firebaseapp.com",
		   databaseURL: "https://to-do-places.firebaseio.com",
		   projectId: "to-do-places",
		   storageBucket: "to-do-places.appspot.com",
		   messagingSenderId: "329838193586"
		 };
		 firebase.initializeApp(config);

var auth = firebase.auth();
var db = firebase.database();

	$("#new-user").on("click", function(event){
	    event.preventDefault();

	    var email = $("#email").val().trim(),
	    password = $("#pass").val().trim();

	    console.log("email: " + email, ";password: " + password);

	    var createUser = auth.createUserWithEmailAndPassword(email, password);

	    createUser
	    .then(function(user) {
	        console.log(user);
	        alert("yay! new user created!");
					var newUser = {
						id:user.uid,
						email:user.email,
					};
					var userpath = db.ref("users/" + user.uid);
					userpath.set(newUser);

					location.href = "index.html";

	    })
	    .catch(function(err){
	        console.log(err);
	        alert(err.message);

	    });

	});


	$("#sign-in").on("click", function(event){
	    event.preventDefault();

	    var signIn = auth.signInWithEmailAndPassword(email, password);

	    signIn
	    .then(function(user) {
	        console.log(user);
	        alert("yay! siged in!")

	    })
	    .catch(function(err){
	        console.log(err);
	        alert(err.message);


	});

	});



});
