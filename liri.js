require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdbKey = keys.omdb.key;
const axios = require("axios");
// console.log(keys.omdb.key)

// console.log(process.argv);

switch (process.argv[2]) {
    case "spotify-this-song":
        let songTitle = [];
        for (let i = 3; i < process.argv.length; i++) {
            songTitle.push(process.argv[i]);
        }
        songTitle = songTitle.join(" ");
        runSpotify(songTitle);
        break;
    case "movie-this":
        let movieTitle = [];
        for (let i = 3; i < process.argv.length; i++) {
            movieTitle.push(process.argv[i]);
        }
        movieTitle = movieTitle.join("+");
        // console.log(movieTitle);
        runOMDB(movieTitle);
        break;
    default:
        console.log("this is not working as expected");
}










// Functions for running the different switches


function runSpotify(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let answer = data.tracks.items[0];
        console.log("-----------------------------");
        console.log("Song Title: " + answer.name);
        console.log("-----------------------------");
        console.log("Band: " + answer.artists[0].name);
        console.log("-----------------------------");
        console.log("Album Name: " + answer.album.name);
        console.log("-----------------------------");
        console.log("Preview link for Spotify: " + answer.external_urls.spotify);

    });
};

function runOMDB(movie) {
    // console.log(movie);
    // console.log(omdbKey);
    axios.get("http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + movie).then(function (response) {
        // console.log(response.data);
        let info = response.data;
        console.log("-------------------------------");
        console.log("Movie Title: "+info.Title);
        console.log("-------------------------------");
        let year = info.Released.split(" ");
        console.log("Release Year: " + year[2]);
        console.log("-------------------------------");
        console.log(info.Ratings[0].Source + " Rating: " + info.Ratings[0].Value);
        console.log("-------------------------------");
        console.log(info.Ratings[1].Source + " Rating: " + info.Ratings[1].Value);
        console.log("-------------------------------");
        console.log("Country of Production: "+info.Country);
        console.log("-------------------------------");
        console.log("Language: "+info.Language);
        console.log("-------------------------------");
        console.log("Plot: "+info.Plot);
        console.log("-------------------------------");
        console.log("Actors: "+info.Actors);
        console.log("-------------------------------");



    }).catch(function(err){
        // console.log(err);
    })
}
