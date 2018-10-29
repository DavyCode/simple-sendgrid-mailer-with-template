const 
    express = require('express'),
    app = express(),
    config = require('./config'),
    ejs = require('ejs'),
    Mailer = require('./Mailer')();



app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const mailOption = { 
        email: 'test@test.com', 
        username: "Tim Cook", 
        templateName: 'welcome', // this name should match the name of the template you want to load
        link: "http://test.com"  //'link for user to click on '
    };
    
    Mailer.sendMail(mailOption).then((response) => {
        return res.send('Mail sent woohooo')
    })
    .catch((e) => {
        return res.send('Mail was not sent')
    })
    
});


app.listen(process.env.PORT || config.Port, () => {
  console.log(`App started on port ${config.Port}`)
});

