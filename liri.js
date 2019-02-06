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
        message: "What would you like to learn today".green,
        choices: [
            "Song Details",
            "Movie Facts",
            "Band/Artist Concert Information",
            "You Decide For Me"
        ]
    },
).then((answer) => {
    switch (answer.method) {
        case "Song Details":
            inquirer.prompt(
                {
                    type: "input",
                    name: "songName",
                    message: "Which song would you like to know more about?".green
                }
            ).then((answer) => {
                if (answer.songName != "") {
                    runSpotify(answer.songName);
                } else {
                    runSpotify("Danger Zone");
                }
            });
            break;
        case "Movie Facts":
            inquirer.prompt(
                {
                    type: "input",
                    name: "movieName",
                    message: "Which movie would you like to know more about?".green
                }
            ).then((answer) => {
                if (answer.movieName != "") {
                    runOMDB(answer.movieName)
                } else {
                    runOMDB("Mr. Nobody");
                }
            });
            break;
        case "Band/Artist Concert Information":
            inquirer.prompt(
                {
                    type: "input",
                    name: "bandName",
                    message: "Which band/artist would you like to know about their upcoming shows?".green
                }
            ).then((answer) => {
                if (answer.bandName != "") {
                    runBandsInTown(answer.bandName)
                } else {
                    runBandsInTown("Metallica")
                }
            });
            break;
        case "You Decide For Me":
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
        if (data.tracks.total == 0){
            console.log("There was an error in your search, please check your spelling and try again".red);
            return;
        };
        let answers = data.tracks.items;

        if (answers.length > 5) {
            answers = answers.slice(0, 5);
        };

        let songStructure = answers.map((song) => {
            return { name: song.name, artist: song.artists[0].name, album: song.album.name, listen: song.external_urls.spotify }
        })

        songStructure.forEach((song) => {
            let displaySong = new Table({
                head: ["Song Detail".green, "Information".green]
            });
            displaySong.push(
                { "Song Title": song.name.cyan },
                { "Band/Artist": song.artist.cyan },
                { "Album Name": song.album.cyan },
                { "Listen": song.listen.cyan }
            );
            console.log(displaySong.toString());
        });

    });
};

function runOMDB(movie) {
    fs.appendFile("./log.txt", "ran movie-this: " + movie + " on " + now + "; ", (err) => { if (err) throw err });
    axios.get("http://www.omdbapi.com/?apikey=" + omdbKey + "&plot=short&t=" + movie).then((response) => {
        let info = response.data;
        console.log("-------------------------------".red);
        console.log("Movie Title: ".green + info.Title.cyan);
        let year = info.Released.split(" ");
        console.log("Release Year: ".green + year[2].cyan);
        console.log(info.Ratings[0].Source.green + " Rating: ".green + info.Ratings[0].Value.cyan);
        console.log(info.Ratings[1].Source.green + " Rating: ".green + info.Ratings[1].Value.cyan);
        console.log("Country of Production: ".green + info.Country.cyan);
        console.log("Language: ".green + info.Language.cyan);
        console.log("Plot: ".green + info.Plot.cyan);
        console.log("Actors: ".green + info.Actors.cyan);
        console.log("-------------------------------".red);

    }).catch((err) => console.log("There was an error with your search, please check your spelling and try again".red));
}

function runBandsInTown(band) {
    fs.appendFile("./log.txt", "ran concert-this: " + band + " on " + now + "; ", (err) => { if (err) throw err });

    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=" + bandKey).then((response) => {
        if (response.data != "") {
            console.log("You searched for the artist " + band.green);
            let newArray = response.data.map((event) => {
                return { name: event.venue.name, place: event.venue.city + ", " + event.venue.country, date: event.datetime }
            })
            if (newArray.length > 15) {
                newArray = newArray.slice(0, 15);
            }
            newArray.forEach((event) => {
                let show = moment(event.date).format("MM/DD/YYYY");
                let displayShow = new Table({
                    head: ["Concert Detail".green, "Infortmation".green]
                })
                displayShow.push(
                    { "Name of Venue": event.name.cyan },
                    { "Venue Location": event.place.cyan },
                    { "Date of Show": show.cyan },
                )
                console.log(displayShow.toString());
            })
        } else {
            console.log("There are no upcoming shows for that artist".blue)
        }

    }).catch((err) => { console.log("There was an error with your search, please check your spelling and try again.".red) })
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