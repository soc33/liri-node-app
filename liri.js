require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

var userInput = process.argv;
var userChoice = userInput.splice(3).join(" ");

var chooseCase = function (argument1, argument2){
    switch (argument1) {
        case "concert-this":
            concertThis(argument2);
            break;
        case "spotify-this-song":
            spotifyThis(argument2);
            break;
        case "movie-this":
            movieThis(argument2);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        case "change-text":
            changeText(argument2);
            break;
        case "help":
            console.log("Available options are: concert-this + (band or artist name), spotify-this-song + (song name), movie-this + (movie name), do-what-it-says, or change-text + (newcommand)");
            break;
        default:
            console.log("That was not a vaild parameter, type 'help' for current list of acceptable answers.");
            break;
    }
}

chooseCase(process.argv[2], userChoice);

function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response1) {
            // console.log(response1);
            var information = response1.data;
            for (i = 0; i < information.length; i++) {
                console.log("Venue name: " + information[i].venue.name);
                console.log("City location: " + information[i].venue.city);
                console.log("Date of concert: " + moment(information[i].datetime).format("MM/DD/YYYY"));
                console.log("-------------------------")
            };
        });
};

var getArtist = function(artist) {
    return artist.name;
}

function spotifyThis(song) {
    if (!song) {
        var song = "The Sign";
    }
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var information = data.tracks.items;
        for (i = 0; i < information.length; i++) {
            console.log("The artist is: " + information[i].artists.map(getArtist));
            console.log("The name of the song is: " + information[i].name);
            console.log("The link to a prview is: " + information[i].preview_url);
            console.log("The name of the album is: " + information[i].album.name);
            console.log("----------------------------------------");
        }
    });

};
function movieThis(movie) {
    if (!movie) {
        var movie = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response2) {
            console.log("The movie's Title is: " + response2.data.Title);
            console.log("The movie's release year is: " + response2.data.Year);
            console.log("The movie's imdbrating is: " + response2.data.imdbRating);
            console.log("The movie's rotten tomatoes rating is: " + response2.data.Ratings[1].Value);
            console.log("The movie's plot is: " + response2.data.Plot);
            console.log("The movie's main actors are: " + response2.data.Actors);
            console.log("The movie's country of origin is: " + response2.data.Country);
            console.log("The movie's origin language is: " + response2.data.Language);
        }
    );


};

function doWhatItSays() {
    fs.readFile("random.txt", "utf-8", function (err, data) {
        if (err) {
            console.log(err);
        }
        var parameters = data.split(", ");
        // console.log(parameters);
        chooseCase(parameters[0], parameters[1]);
    });
};

function changeText(choice) {
    var changes = choice.split(" ");
    var chosen = changes.splice(1).join(" ");
    console.log(changes + " " + chosen);

    fs.writeFile("random.txt", changes[0] + ', ' + chosen, function (err) {
        if (err) {
            console.log(err);
        }
    })
}