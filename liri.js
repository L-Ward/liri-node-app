//Required to get info from .env to keys.js
require("dotenv").config();

//requires
var fs = require("fs");
var request = require("request");
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//access api keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb.api_key;

//take user input and respond accordingly
liri(process.argv[2], process.argv[3]);

// Function takes in input1 = command and input2 = argument
function liri(input1, input2) {
    switch (input1) {
        case "my-tweets":
            displayTweets();
            break;

        case "spotify-this-song":
            displaySpotify(input2);
            break;

        case "movie-this":
            displayMovie(input2);
            break;

        case "do-what-it-says":
            doWhat();
            break;

        default:
            console.log("Invalid command. Try: my-tweets, spotify-this-song, movie-this or do-what-it-says.");
            break;
    }
}

//FUNCTIONS
function displayTweets() {
    var params = {};
    client.get('statuses/user_timeline', params, (error, tweets, _) => {
        if (!error) {
            tweets.forEach(element => console.log(element.text));
        }
    });
}

function displaySpotify(songTitle) {
    if (!songTitle) {
        songTitle = "The sign artist:Ace of Base";
    }
    spotify.search({ type: 'track', query: songTitle }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("The song, " + data.tracks.items[0].name + " was performed by " + data.tracks.items[0].artists[0].name + ".");
        console.log("It was released on the " + data.tracks.items[0].album.name + " album.");
        if (data.tracks.items[0].preview_url) {
            console.log("A preview can be heard here: " + data.tracks.items[0].preview_url + ".");
        }
    });
}

function displayMovie(movieTitle) {
    if (!movieTitle) {
        movieTitle = "Mr. Nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&apikey=" + omdb;
    request(queryUrl, (error, response, body) => {
        // Request to the queryUrl
        // If the request is successful
        if (!error && response.statusCode === 200) {
            console.log("The movie " + JSON.parse(body).Title + ",");
            console.log("was released in " + JSON.parse(body).Year + ".");
            console.log("IMDB rated it " + JSON.parse(body).Ratings[0].Value + ".");
            console.log("Rotten Tomatoes rated it " + JSON.parse(body).Ratings[1].Value + ".");
            console.log(JSON.parse(body).Title + " was produced in " + JSON.parse(body).Country + ".");
            console.log("It was filmed in " + JSON.parse(body).Language + ".");
            console.log("Starring: " + JSON.parse(body).Actors);
            console.log(JSON.parse(body).Plot);
        }
    });
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.split(",");
        userInput = data[0];
        secondInput = data[1];
        liri(userInput, secondInput);
    });
}
