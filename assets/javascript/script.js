// Initialize Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDLGaZODcTjzt7w8rwq_McWvw7uMav914U",
    authDomain: "train-scheduler-c3a35.firebaseapp.com",
    databaseURL: "https://train-scheduler-c3a35.firebaseio.com",
    projectId: "train-scheduler-c3a35",
    storageBucket: "train-scheduler-c3a35.appspot.com",
    messagingSenderId: "754094566555",
    appId: "1:754094566555:web:6ea85f47f55a5b7c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();


// Button for adding new train schedule
$(".btn").on("click", function(event) {
    event.preventDefault();

    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim()

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    }

    // Upload train data to database
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency)

    // Clear text-box fields
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
});


// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    console.log("Name: " + trainName);
    console.log("Destination: " + trainDestination);
    console.log("First Train Time: " + trainTime);
    console.log("Frequency: " + trainFrequency);


    // Calculate when next train will arrive relative to current time
    var currentTime = moment();
    console.log("Current Time: " + currentTime);

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log("Time Converted: " + firstTimeConverted);

    // Difference between the times
    var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Time Difference: " + timeDifference);

    // Time remainder
    var timeRemainder = timeDifference % trainFrequency;
    console.log("Time Remainder: " + timeRemainder);

    // Minutes until next train arrival
    var minutes = trainFrequency - timeRemainder;
    console.log("Minutes until next train: " + minutes);

    // Next train arrival
    var nextArrival = moment().add(minutes, "minutes");
    console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));
    var formattedTime = moment(nextArrival).format("HH:mm");

    // Add each train to the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + formattedTime + "</td><td>" + minutes + "</td>");

});