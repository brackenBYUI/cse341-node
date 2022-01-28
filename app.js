const path = require('path');
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('61f31503a7748768c94ab901')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://bdoney:T1tleist1993@cse341.tdtpc.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Bracken',
                    email: 'bracken@test',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })
        app.listen(PORT)
    })
    .catch(err => {
        console.log(err)
    })


