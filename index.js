const express = require('express');
const exphbs = require('express-handlebars');

const fileUpload = require('express-fileupload')
const app = express();

// Templating Engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');


const bodyParser = require('body-parser');
// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Static Files
app.use(express.static('public'));

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/klipform');

const Form = require('./models/form')


const AWS = require('aws-sdk')

AWS.config.update({
 accessKeyId: 'AKIA3ZCVAXZKJHYEKIMM',
 secretAccessKey: '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'
})

const s3 = new AWS.S3({ params: { Bucket: 'klipvalley-bucket3' }});


const path = require('path');

const generateUniqueFileName = (fileName) => {
  const extension = path.extname(fileName)
  const date = Date.now();

  let randomHash = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  new Array(20).fill(null).map(_ => {
    randomHash += characters.charAt(Math.floor(Math.random() * characters.length));
  })

  return `${randomHash}-${date}${extension}`
}


app.use(fileUpload({
  // 50mb file limit
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true
}));

// app.get('/', (req, res) => {
//   res.sendFile('views/apply.html' , { root : __dirname});
// })



app.get('/', (req, res) => {
  
  res.render('home');
});

app.get('/apply', function (req, res) {
  res.render('apply');
});

app.get('/newsletter', function (req, res) {
  res.render('newsletter');
});

app.get('/liabra', function (req, res) {
  res.render('liabra');
});

app.get('/teachers', function (req, res) {
  res.render('teachers');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/contact', function (req, res) {
  res.render('contact');
});

app.get('/events', function (req, res) {
  res.render('events');
});

app.get('/event-detail', function (req, res) {
  res.render('event-detail');
});

app.get('/gallery', function (req, res) {
  res.render('gallery');
});

app.get('/pictures', function (req, res) {
  res.render('pictures');
});


// endpoint that will handle the form
app.post('/submit',async (req, res) => {
  const {body, files} = req

try {
    const upload = new AWS.S3.ManagedUpload({
      params: { 
        // pass directly the buffer string
        
        Body: files.applicationForm.data, 
       // Body: files.idChild.data, 
        // pass the file name
       // Key: files.photo.name,
        Key: files.applicationForm.name,
      //  Key: generateUniqueFileName(files.idChild.name),
        // make it public
        ACL: 'public-read',

        // Body: files.idChild.data,
        // Key: files.idChild.name,
        // ACL: 'public-read'
      },


      // params: { 
      //   // pass directly the buffer string
        
      // //  Body: files.applicationForm.data, 
      //   Body: files.idChild.data, 
      //   // pass the file name
      //  // Key: files.photo.name,
      // //  Key: generateUniqueFileName(files.applicationForm.name),
      //   Key: files.idChild.name,
      //   // make it public
      //   ACL: 'public-read'
      // },



      // use the const s3 that we defined above
      service: s3,
    })

    const response = await upload.promise()   

        const { firstname, surname, grade } = req.body
    const submission = new Form({
      firstname: firstname,
      surname: surname,
      grade: grade,
      applicationForm: response.Location,
     // idChild: response.Location,
    })

    submission.save()

   // res.send(response)
 res.send(submission)
  } catch (error) {
 res.send(error)
  }


//return res.send({body, files})
})


app.post('/submi',async (req, res) => {
  const {body, files} = req

try {
    const upload = new AWS.S3.ManagedUpload({
      params: { 
        // pass directly the buffer string
        Body: files.idChild.data, 
        // pass the file name
        Key: files.idChild.name,
        // make it public
        ACL: 'public-read',
      },

      // use the const s3 that we defined above
      service: s3,
    })

    const response = await upload.promise()
    

       
    const submission = new Form({
      
      idChild: response.Location,
    })

    submission.save()

   // res.send(response)
 res.send(submission)
  } catch (error) {
 res.send(error)
  }

//return res.send({body, files})
})








//const port = 3031
const PORT = process.env.PORT || 27017

// app.listen(port, () => {
//   console.log(`Application is available at http://localhost:${port}`)
// })

app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});