require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdbKey = keys.omdb.key;
const axios = require("axios");
const bandKey = keys.bandTown.key;
const fs = require("fs");

switch (process.argv[2]) {
    case "spotify-this-song":
        if (process.argv.length > 3) {
            let songTitle = [];
            for (let i = 3; i < process.argv.length; i++) {
                songTitle.push(process.argv[i]);
            }
            songTitle = songTitle.join(" ");
            runSpotify(songTitle);
        } else {
            let sign = "The Sign"
            runSpotify(sign);
        }
        break;
    case "movie-this":
        if (process.argv.length > 3) {
            let movieTitle = [];
            for (let i = 3; i < process.argv.length; i++) {
                movieTitle.push(process.argv[i]);
            }
            movieTitle = movieTitle.join("+");
            runOMDB(movieTitle);
        } else {
            let nobody = "Mr. Nobody"
            runOMDB(nobody);
        }
        break;
    case "concert-this":
        if (process.argv.length > 3) {
            let bandName = [];
            for (let i = 3; i < process.argv.length; i++) {
                bandName.push(process.argv[i]);
            }
            bandName = bandName.join("+");
            runBandsInTown(bandName);
        } else {
            let myBand = "Metallica"
            runBandsInTown(myBand);
        }
        break;
    case "do-what-it-says":
        runRandom();
        break;
    default:
        console.log("this is not working as expected");
}




// Functions for running the different process.argv[2]


function runSpotify(song) {
    spotify.search({ type: 'track', query: song }, (err, data) => {
        if (err) throw err;
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
    axios.get("http://www.omdbapi.com/?apikey=" + omdbKey + "&plot=short&t=" + movie).then((response) => {
        let info = response.data;
        console.log("-------------------------------");
        console.log("Movie Title: " + info.Title);
        console.log("-------------------------------");
        let year = info.Released.split(" ");
        console.log("Release Year: " + year[2]);
        console.log("-------------------------------");
        console.log(info.Ratings[0].Source + " Rating: " + info.Ratings[0].Value);
        console.log("-------------------------------");
        console.log(info.Ratings[1].Source + " Rating: " + info.Ratings[1].Value);
        console.log("-------------------------------");
        console.log("Country of Production: " + info.Country);
        console.log("-------------------------------");
        console.log("Language: " + info.Language);
        console.log("-------------------------------");
        console.log("Plot: " + info.Plot);
        console.log("-------------------------------");
        console.log("Actors: " + info.Actors);
        console.log("-------------------------------");
    }).catch((err) => { console.log(err) });
}

function runBandsInTown(band) {
    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=" + bandKey).then((response) => {
        let newArray = response.data.map((event) => {
            return { name: event.venue.name, place: event.venue.city + ", " + event.venue.country, date: event.datetime }
        })
        newArray.forEach((event) => {
            console.log("----------------------------")
            console.log("Name of Venue: " + event.name);
            console.log("Venue Location: " + event.place);
            console.log("Date of Concert: " + event.date);
        })
    }).catch((err) => { console.log(err) })
};

function runRandom() {
    fs.readFile('./random.txt', "utf8", (err, data) => {
        if (err) throw err;
        // let randomArray = data.replace(/\r\n/g, ";").split(";");
        // console.log(randomArray);
        // let orderedArray = randomArray.map((line)=>{
        //     return line.split(",");
        // });
        // console.log(orderedArray);
        // let runArray = orderedArray.map((part)=>{
        //     return {type: part[0], string: part[1]};
        // });
        // console.log(runArray);
        console.log(data.split(";"));
    });
}
