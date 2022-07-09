const express = require("express");
const app = express();
const dbConnect = require('./db/dbConnect');
const bcrypt = require('bcrypt');
const User = require('./db/userModel');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

dbConnect();
//Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

//body parser configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
    res.json({ message: "Hey! This is your server response!" });
    next();
});

//register user
app.post('/register', (req, res) => {
    //hash the password
    bcrypt.hash(req.body.password, 10).then(hashedPass => {
        const user = new User({ email: req.body.email, password: hashedPass });
        user.save().then(result => {
            res.status(201).send({ message: 'User created successfully', result });
        }).catch(err => { res.status(500).send({ message: 'Eroor creating user', err }) });
    }).catch(e => { res.status(500).send({ message: 'Password was not hashed successfully', e }) });
});

//login user
app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(passwordCheck => {
            if (!passwordCheck) return res.status(400).send({ message: 'Passwords does not match', error });

            const token = jwt.sign({ userID: user._id, userEmail: user.email }, 'RANDOM-TOKEN', { expiresIn: '24h' });
            res.status(200).send({ message: 'Login successful', email: user.email, token });
        }).catch(e => { res.status(400).send({ message: 'Passwords does not match', e }); });
    }).catch(eerr => { res.status(404).send({ message: 'Email not found', eerr }); });
});

//free endpoint
app.get('/free-endpoint', (req, res) => {
    res.json({ message: "You are free to access me anytime :)" });
});

//auth endpoint
app.get('/auth-endpoint', auth, (req, res) => {
    res.json({ message: "You are authorized to access me" });
});

module.exports = app;