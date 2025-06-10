import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbConnect } from './configs/database.js';

// import './z.clean_db.js';

import tokenChecker from './middleware/tokenChecker.js';
import signup from './controllers/Auth/signup.js';
import signin from './controllers/Auth/signin.js';
import gsign from './controllers/Auth/gsign.js';

import updateProfile from './controllers/ProfileData/updateProfile.js';
import updateHandles from './controllers/ProfileData/updateHandles.js';
import getProfileData from './controllers/ProfileData/getProfileData.js';

import toggleFriend from './controllers/Friends/toggleFriend.js';

import dashboardData from './controllers/PageData/dashBoardData.js';
import smartSheetData from './controllers/PageData/smartSheet.js';
import { getAllConnections, searchUser } from './controllers/PageData/networkData.js';
import { addToFavorite, getFavorites, getUpsolve, removeFromFavorite } from './controllers/PageData/contestActions.js';
import { addStumble, getAllStumbles, removeStumble } from './controllers/PageData/stumbles.js';
import { addConcept, editConcept, getAllConcepts, removeConcept } from './controllers/PageData/concepts.js';

//---Configs
const app = express();
dbConnect();

//---Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'https://algoknight.onrender.com'], 
    credentials: true               
}));

//body parsers
app.use(express.json());                           //json parser
app.use(express.urlencoded({ extended: true }));  //x-www... parser
app.use(cookieParser());

app.use(tokenChecker());

//---Routes
app.get("/", (req, res) => {
    res.send("Hello World !")
})

app.post("/auth/signup", signup)
app.post("/auth/signin", signin)
app.post("/auth/gsign", gsign)

app.get("/profile/getProfileData", getProfileData)
app.post("/profile/updateProfile", updateProfile)
app.post("/profile/updateHandles", updateHandles)

app.get("/saved/stumbles/get", getAllStumbles)
app.post("/saved/stumbles/add", addStumble)
app.post("/saved/stumbles/remove", removeStumble)

app.get("/saved/concepts/get", getAllConcepts)
app.post("/saved/concepts/add", addConcept)
app.post("/saved/concepts/edit", editConcept)
app.post("/saved/concepts/remove", removeConcept)

app.post("/friends/toggleFriend", toggleFriend)

app.get("/fetch/dashboard", dashboardData)
app.get("/fetch/network", getAllConnections)
app.post("/fetch/searchUser", searchUser)          //To search for new users while expanding network
app.get("/fetch/smartSheet", smartSheetData)

app.get("/contests/upsolve", getUpsolve);
app.get("/contests/favorites/get", getFavorites);
app.post("/contests/favorites/add", addToFavorite);
app.post("/contests/favorites/remove", removeFromFavorite);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})