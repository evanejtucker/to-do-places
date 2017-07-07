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
		$("#continue").show();
		$("#guest").hide();
		// location.href = "index.html";

	} else {
		console.log("no User Signed In");
		$("#sign-out").hide();
		$("#continue").hide();

	}
});

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length} ;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex-1].style.display = "block";
};

});
