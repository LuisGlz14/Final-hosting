const functions = require('firebase-functions');
const firebase = require('firebase/app');
require('firebase/firestore');
const firebaseConfig = {
    apiKey: "AIzaSyDRujVZlxIzY8uNrWt0vIyf57Q1zovwbzs",
    authDomain: "proy-isc-6a-2020.firebaseapp.com",
    databaseURL: "https://proy-isc-6a-2020.firebaseio.com",
    projectId: "proy-isc-6a-2020",
    storageBucket: "proy-isc-6a-2020.appspot.com",
    messagingSenderId: "820223739304",
    appId: "1:820223739304:web:a21cc82117807ac09b899d"
  };
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

firebase.initializeApp(firebaseConfig);

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.route('/api/agregarUsuario').post((req, res) => {
    const name = req.body.username;
    firebase.firestore().collection('users').doc(name).set(req.body)
    .then( exito => {
        res.send({res: true});
        return true;
    })
    .catch( error => {
        res.send({res: false});
    });
});

app.route('/api/email').post((req, res) => {
    const {nombre, correo, contenido} = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'simple.contactanos@gmail.com',
            pass: 'Contrasena123'
        }
    });
    const mailOptions = {
        from: 'simple.contactanos@gmail.com',
        to: 'omarshark23@gmail.com',
        subject: 'Contáctanos: ' + nombre,
        text: `Correo: ${correo}\nDuda: ${contenido}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({message: 'Error mandando el correo'});
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({message: 'Correo mandado con exito'});
        }
    });
});

exports.app = functions.https.onRequest(app);
