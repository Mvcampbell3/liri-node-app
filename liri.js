require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

// console.log(process.argv);

switch (process.argv[2]) {
    case "spotify-this-song":
        let searchTerm = [];
        for (let i = 3; i < process.argv.length; i++){
            searchTerm.push(process.argv[i]);
        }
        searchTerm = searchTerm.join(" ");
        runSpotify(searchTerm);
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
}
