import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
import handleRegister from './controllers/register.js';
import handleSignIn from './controllers/signin.js';
import handleProfile from './controllers/profile.js';
import { handleFaceDetectionEntries, handleClarifaiApiCall } from './controllers/image.js';

const app = express();

// Using Express.Js middleware service
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//enabling cors to bypass cors() error while fetch() in frontend side
app.use(cors());

// Creating a database variable with fake data
// Commenting this database variable since now we are using the actual database for storing the data
// let database = {
//     users: [
//         {
//             id: "01",
//             name: "Haider",
//             email: "haider@gmail.com",
//             password: "haider123",
//             entries: 0,   // entries depict the number of times a user has performed a successful face-detection on image.
//             joined: new Date()
//         },
//         {
//             id: "02",
//             name: "Rahul",
//             email: "rahul@gmail.com",
//             password: "rahul234",
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// };

// Using Environment Variables
const DB_HOST = process.env.SMART_BRAIN_DB_HOST;
const DB_USER = process.env.SMART_BRAIN_DB_USERNAME;
const DB_PASSWORD = process.env.SMART_BRAIN_DB_PASSWORD;
const DB_NAME = process.env.SMART_BRAIN_DB_NAME;

console.log("DB URL is: ", DB_HOST);
console.log("DB User is: ", DB_USER);
console.log("DB Password is: ", DB_PASSWORD);
console.log("DB Name is: ", DB_NAME);

// Initializing the database connection using knex.js
const database = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: { rejectUnauthorized: false }
  },
});


// setting the root route
app.get('/', (req, res) => {
    console.log('Backend Server is listening on port: 3001');
    database.withSchema('smart_brain_user').select('*').from('users')
    .then(data => {
        res.json(data);
    })
})

// creating the /signin endpoint
app.post('/signin', (req, res) => { handleSignIn(req, res, bcrypt, database) });

// creating the /register endpoint
app.post('/register', (req, res) => { handleRegister(req, res, bcrypt, database) });

// creating the /profile/:id endpoint
app.get('/profile/:id', (req, res) => { handleProfile(req, res, database) });

// creating the /image endpoint
app.put('/image', (req, res) => { handleFaceDetectionEntries(req, res, database) });

app.post('/imageurl', (req, res) => { handleClarifaiApiCall(req, res) })

app.listen(3001);

