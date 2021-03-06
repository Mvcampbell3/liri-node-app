require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdbKey = keys.omdb.key;
const axios = require("axios");
const bandKey = keys.bandTown.key;
const fs = require("fs");
const moment = require("moment");
moment().format();
let now = moment().format("LLLL");

let searchTerm = [];
for (let i = 3; i < process.argv.length; i++) {
    searchTerm.push(process.argv[i]);
}

switch (process.argv[2]) {
    case "spotify-this-song":
        if (process.argv.length > 3) {
            searchTerm = searchTerm.join(" ");
            runSpotify(searchTerm);
        } else {
            let sign = "The Sign"
            runSpotify(sign);
        }
        break;
    case "movie-this":
        if (process.argv.length > 3) {
            searchTerm = searchTerm.join("+");
            runOMDB(searchTerm);
        } else {
            let nobody = "Mr. Nobody"
            runOMDB(nobody);
        }
        break;
    case "concert-this":
        if (process.argv.length > 3) {
            search = search.join("+");
            runBandsInTown(search);
        } else {
            let myBand = "Metallica"
            runBandsInTown(myBand);
        }
        break;
    case "do-what-it-says":
        runRandom();
        break;
    default:
        console.log("this is not working as expected, check spelling of your search method");
        runSpotify("Never Gonna Give You Up")
}

function runSpotify(song) {
    fs.appendFile("./log.txt", "ran spotify-this-song: " + song + " on " + now + "; ", (err) => { if (err) throw err });
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
    fs.appendFile("./log.txt", "ran movie-this: " + movie + " on " + now + "; ", (err) => { if (err) throw err });
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
    fs.appendFile("./log.txt", "ran concert-this: " + band + " on " + now + "; ", (err) => { if (err) throw err });

    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=" + bandKey).then((response) => {
        let newArray = response.data.map((event) => {
            return { name: event.venue.name, place: event.venue.city + ", " + event.venue.country, date: event.datetime }
        })
        newArray.forEach((event) => {
            console.log("--------------------------------------------------")
            console.log("Name of Venue: " + event.name);
            console.log("Venue Location: " + event.place);
            let show = moment(event.date).format("MM/DD/YYYY");
            console.log("Date of Show: " + show)
        })
    }).catch((err) => { console.log(err) })
};

function runRandom() {
    fs.readFile('./random.txt', "utf8", (err, data) => {
        if (err) throw err;
        let randomArray = data.split(";")
            .map((going) => going.split(","))
            .map((deep) => {
                return { type: deep[0], string: deep[1] };
            })
        let num = Math.floor(Math.random() * randomArray.length);
        console.log("Randomly picked <" + randomArray[num].type + "> with <" + randomArray[num].string + ">");
        switch (randomArray[num].type) {
            case "spotify-this-song":
                runSpotify(randomArray[num].string);
                break;
            case "movie-this":
                runOMDB(randomArray[num].string);
                break;
            case "concert-this":
                runBandsInTown(randomArray[num].string);
                break;
            default:
                console.log("do-what-it-says switch not working as expected");
                runSpotify("Never Gonna Give You Up");
        }
    });
}
