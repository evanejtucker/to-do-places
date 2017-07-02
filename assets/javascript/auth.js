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


$("#sign-in").on("click", function() {
	event.preventDefault();

	var email = $("#signin-form>.email").val().trim();
	var password = $("#signin-form>.pass").val().trim();

	var promise = auth.signInWithEmailAndPassword(email, password);

	promise.catch(function(err) {
		console.log(err);
	});

});

$("#new-user").on("click", function() {
	event.preventDefault();

	var email = $("#new-user-form>.email").val().trim();
	var password = $("#new-user-form>.pass").val().trim();

	var promise = auth.createUserWithEmailAndPassword(email, password);

	promise.catch(function(err) {
		console.log(err);
	});

	$("#new-user-form>.email").val("");
	$("#new-user-form>.pass").val("");

});

$("#sign-out").on("click", function() {
	firebase.auth().signOut();
});


firebase.auth().onAuthStateChanged(function(firebaseUser) {
	if(firebaseUser) {
		console.log(firebaseUser);
		$("#sign-out").show();
	} else {
		console.log("no User Signed In");
		$("#sign-out").hide();

	}
});
	// $("#new-user").on("click", function(event){
	//     event.preventDefault();

	//     var email = $("#email").val().trim(),
	//     password = $("#pass").val().trim();

	//     console.log("email: " + email, ";password: " + password);

	//     var createUser = auth.createUserWithEmailAndPassword(email, password);

	//     createUser
	//     .then(function(user) {
	//         console.log(user);
	//         alert("yay! new user created!");
	// 				var newUser = {
	// 					id:user.uid,
	// 					email:user.email,
	// 				};
	// 				var userpath = db.ref("users/" + user.uid);
	// 				userpath.set(newUser);

	// 				location.href = "index.html";

	//     })
	//     .catch(function(err){
	//         console.log(err);
	//         alert(err.message);

	//     });

	// });


	// $("#sign-in").on("click", function(event){
	//     event.preventDefault();

	//     var signIn = auth.signInWithEmailAndPassword(email, password);

	//     signIn
	//     .then(function(user) {
	//         console.log(user);
	//         alert("yay! siged in!")

	//     })
	//     .catch(function(err){
	//         console.log(err);
	//         alert(err.message);


	// });

	// });



});
