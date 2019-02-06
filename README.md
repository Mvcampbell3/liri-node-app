# Liri Node Application

Welcome to my <span style="color:green">**Liri App!**</span><br>
This <span style="color:blue">**README**</span> will walk you through how this app works!

# Table of Contents:
1. [Description](#desc)
2. [Installation](#install)
3. [Usage](#use)
4. [Examples](#example)

<a name="desc"></a>
## 1. Description:
This application serves a few purposes at once.
- First: It will give the user the ability to use various commands to receive information.
- Second: It will demonstrate my ability to use technologies such as :<br>
    - Node.js<br>
    - Node Package Manager<br>
    - Axios<br>
    - Moment.js<br>
    - Spotify, OMDB, and BandsInTown APIs<br>
    - Inquirer, cli-table, and colors packages
- Third: It will be fun!

<a name="install"></a>
## 2. Installation:
Gee, that all sounds well and good Michael. How do we use Liri?<br>
**Excellent Question**, but first we have some work to do.<br>

Once you have successfully installed the packages in the folder with you cloned the app with
```
    npm install
```
And have created a .env file containing your API keys
```
# Spotify API keys

SPOTIFY_ID=["something super secret"]
SPOTIFY_SECRET=["something even more super secret"]

# OMDB API key

omdbKey=["kind of secret, I guess"]

# Bands in Town app id

band_app_id=["Good luck with this one"]
```

Congratulations! You are now ready to use the app!!

<a name="use"></a>
## 3. Usage:

Every usage of liri will start with 
```
node liri.js
```
This is getting **exciting** now!

From here we will be prompted with four options:
- Song Details
- Movie Facts
- Band/Artist Concert Information
- You Decide For Me

You will use the up and down arrow keys to pick your selection, then press *_Enter_*

Last Step!

You then need to add the name of whatever it is your are searching for.<br>
That's it!!<br>
Now Liri will scour the API's and return your information.

Here is a breakdown of what to expect:
- Song Details (You will receive up to the top 5 results)
```
Name of the Song.
Name of the Artist.
Name of the Album.
Link to listen on Spotify.
```
- Movie Facts
```
Title of the movie.
Year the movie came out.
IMDB Rating of the movie.
Rotten Tomatoes Rating of the movie.
Country where the movie was produced.
Language of the movie.
Plot of the movie.
Actors in the movie.
```
- Band/Artist Concert Information (You will receive up to the next 15 shows)
```
Name of the venue.
Where the venue is located.
The date of the event
```
- You Decide For Me
    - This will run though my random.txt file and grab an item from it. It could be a movie, a show, or a song!

<a name="example"></a>
## 4. Examples:
<video controls="controls">
  <source type="video/webm" src="./images/liriDemo.webm"></source>
  <p>Your browser does not support the video element.</p>
</video>
