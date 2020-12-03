const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');

// Declare app
const app = express();
const port = 5000;

// middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// default route for server
app.get('/', (req, res) => res.status(200).send({
  message: "Server is ruuning..."
}));


const WriteTextToFileAsync = async (contentToWrite) => {
  fs.writeFile('./src/data.json', contentToWrite, (err) => {
    console.log(contentToWrite);
    if(err) {
      console.log(err);
    } else {
      console.log('Done writing to file...');
    }
  })
}


// Declare post / write route to accept incoming request with data
app.post('/write', async (req, res, next) => {
  // take the body from incoming request by using req.body and convert it into string
  const requestContent = JSON.stringify(req.body);
  await WriteTextToFileAsync(requestContent)
});



// 404 route for server
app.use((req, res, next) => res.status(404).send({
  message: "Could not find specified route that was requested...!"
}));

// Run server
app.listen(port, () => {
  console.log(
    `
    !!! server is running
    !!! Listening for incoming requests on port ${port}
    !!! http://localhost:5000
    `
  )
});

