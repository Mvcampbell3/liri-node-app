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
let inquirer = require("inquirer");
let Table = require("cli-table");
let colors = require("colors");

inquirer.prompt(
    {
        type: "list",
        name: "method",
        message: "What would you like to learn today",
        choices: [
            "Song Details",
            "Movie Facts",
            "Band/Artist Concert Information",
            "You decide For Me"
        ]
    },
).then((answer) => {
    switch (answer.method) {
        case "Song Details":
            inquirer.prompt(
                {
                    type: "input",
                    name: "songName",
                    message: "Which song would you like to know more about?"
                }
            ).then((answer) => runSpotify(answer.songName));
            break;
        case "Movie Facts":
            inquirer.prompt(
                {
                    type: "input",
                    name: "movieName",
                    message: "Which movie would you like to know more about?"
                }
            ).then((answer) => runOMDB(answer.movieName));
            break;
        case "Band/Artist Concert Information":
            inquirer.prompt(
                {
                    type: "input",
                    name: "bandName",
                    message: "Which band/artist would you like to know about their upcoming shows?"
                }
            ).then((answer) => runBandsInTown(answer.bandName));
            break;
        case "You decide For Me":
            console.log("I will decide for you");
            runRandom();
            break;
        default:
            console.log("somehow you have managed to mess this up already");
    }
});

function runSpotify(song) {
    fs.appendFile("./log.txt", "ran spotify-this-song: " + song + " on " + now + "; ", (err) => { if (err) throw err });
    spotify.search({ type: 'track', query: song }, (err, data) => {
        if (err) throw err;
        let answer = data.tracks.items[0];
        let displaySong = new Table({
            head: ["Song Detail", "Information"]
        })
        displaySong.push(
            { "Song Title": answer.name },
            { "Band/Artist": answer.artists[0].name },
            { "Album Name": answer.album.name },
            { "Listen": answer.external_urls.spotify }
        );
        console.log(displaySong.toString());
    });
};

function runOMDB(movie) {
    fs.appendFile("./log.txt", "ran movie-this: " + movie + " on " + now + "; ", (err) => { if (err) throw err });
    axios.get("http://www.omdbapi.com/?apikey=" + omdbKey + "&plot=short&t=" + movie).then((response) => {
        let info = response.data;
        console.log("-------------------------------".red);
        console.log("Movie Title: ".green + info.Title.blue);
        let year = info.Released.split(" ");
        console.log("Release Year: ".green + year[2].blue);
        console.log(info.Ratings[0].Source.green + " Rating: ".green + info.Ratings[0].Value.blue);
        console.log(info.Ratings[1].Source.green + " Rating: ".green + info.Ratings[1].Value.blue);
        console.log("Country of Production: ".green + info.Country.blue);
        console.log("Language: ".green + info.Language.blue);
        console.log("Plot: ".green + info.Plot.blue);
        console.log("Actors: ".green + info.Actors.blue);
        console.log("-------------------------------".red);

    }).catch((err) => { console.log(err) });
}

function runBandsInTown(band) {
    fs.appendFile("./log.txt", "ran concert-this: " + band + " on " + now + "; ", (err) => { if (err) throw err });

    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=" + bandKey).then((response) => {
        let newArray = response.data.map((event) => {
            return { name: event.venue.name, place: event.venue.city + ", " + event.venue.country, date: event.datetime }
        })
        console.log(newArray.length);

        if (newArray.length > 15) {
            newArray = newArray.slice(0, 15);
        }

        console.log(newArray.length);

        
        newArray.forEach((event) => {
            // console.log("--------------------------------------------------")
            // console.log("Name of Venue: " + event.name);
            // console.log("Venue Location: " + event.place);
            let show = moment(event.date).format("MM/DD/YYYY");
            // console.log("Date of Show: " + show)
            let displayShow = new Table({
                head: ["Concert Detail", "Infortmation"]
            })
            displayShow.push(
                {"Name of Venue": event.name},
                {"Venue Location": event.place},
                {"Date of Show": show},
            )
            console.log(displayShow.toString());
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