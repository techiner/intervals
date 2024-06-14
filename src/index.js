const express = require('express');
const handlebars = require('express-handlebars');
const home = require('./controllers/home');

const app = express();

app.set('views', './src/views');
app.set('view engine', 'handlebars');
app.use(express.static(`src/assets`));

app.engine(
    'handlebars',
    handlebars.engine({ defaultLayout: 'main' })
);

// const host = '127.0.0.1';
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(
    `Server started on port ${PORT}`));




app.get('/', (req, res) => {
    home.makeAudio()
    res.render('home', {
        audio1: "accord_1.mp3",
        audio2: "accord_2.mp3"
    });
});

