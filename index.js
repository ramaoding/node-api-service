const express = require('express')
const app = express()
const port = 3000

//Other
const axios = require('axios')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.post('/snap-bca/public/open-api/v1.0/generate', (req, res) => {
  let data = {};
  data.status = 200;
  data.message = "Success!";
  data.header = req.headers;
  data.body = req.body
  res.status(200).json(data)
})

app.post('/snap-bca/public/open-api/v1.0/test', (req, res) => {
  let data = {};
  axios.get('http://localhost:3200/bca')
  .then(function (response) {
    // handle success
    data.status = 200;
    data.message = "Success!";
    data.header = req.headers;
    data.body = req.body
    data.response = response.data;
    console.log(response.data);
    res.status(200).json(data)
  })
  .catch(function (error) {
    // handle error
    data.status = 400;
    data.message = "Failed!";
    res.status(400).json(data)
  })
  // .finally(function () {
  //   // always executed
  // });

  
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})