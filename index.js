const express = require('express');
const app = express();
const port = 3000;

//Other Import
const axios = require('axios');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const signatureUtil = require('./SignatureUtil');

app.post('/open-api/v1.0/*', (req, res) => {
  console.log('jalan salah');
  let endpoint = req.url.replace('/open-api/v1.0/','');
  if(endpoint == 'access-token/b2b'){
    let privateKey = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCugPTyjFhr4BCOGKT9WC4YV+JR/sZrc3F/+M6U0fLmqHIgqvnqP2VNUPzIrH1CbSxx4x+nuXILo83JCfKneNmPXgXn0WwgLhKbV20RNnbU4NX382j5jNWPR6j/XMy1KKb0dbq6RVRI+hdrbrXxcFu3AU3iqo6SN1xksayfkph2vtIaeNkp78oPJmwYc9BJlcBNcoNSlypTnrPHaS74B2W/+906t6brSZaDo9LLyLcU4jU1eCg0mh0P2FV8dm7xLCR6kEB8oKoN+QcvYK5Uq/M5VIeOkPodsALBn+WZq8QXz1L+eF3E3uxUvXbaPOWyxsTH7r8h38NHZBLrrPxzpBZbAgMBAAECggEBAJM0u+1kES8nPC/ygDQrT+8/K+9Jgi6gmy1+QR5voX2MuYHvWZWO1zEK0cOjJqODn0uPcmO134wMKYufNbCrFLSJd2fgVVssIowiiyJLFKFt7XIWRwbFFF6i7+BDc3ibC4QLUHLUC07okhsRsLA0vVm64u4EPPMBepKDA4E1VCJOXwY+KqWddL6mI1fhJ/jpy/Jk6+CmDpwmQBHksSH8YhNCO4v9J/jg3yDFIpO6b4nkm22nAYCJotiN3zpq2NRWq6L4MktwsOg4gS/Are7Hhn8+q9cpFY7sfbau9vNLiIFyh60DPmEj51bsYB9wWkFuNJfKlvzoslW7NofVMF8TXykCgYEA5P/UGc5KD+yghbA0SoY3GWicR/hjcUlJ7x0Ey7pJEo6aODdzCgATiL7UvkGISbufVuhWQQs5ddHvAGb5dsfmKKMDxWyr2VywBHktWm8S6tl5i4PhSbdxmdQmt8iKphgDS5osk9S31qYhS3fedpeWRrwvCsjlP0nTsPkZqGhqQCcCgYEAwxQ4V5j+D/wamddKgvFdtmtTwWw0t5lroNQ/sL+zvT+A0E/gkfG48N8Fb8kibeACclfra1CmC4GbVhxPAWE6BL5azY16CgdFylyB4cBtHYOTH2RjwQOGXG3QsFZIgpylwI5EikoV/ujqJKI+wNFitLk0LFF1xA1bNEMoW2Qs5K0CgYEAyI2VABS+oDuoSe0Lnsj0sHgBhrZuwORir9tGO/Yl0O66+cj2Iyf186jNQOK7rXd4EPDhuY1PAXSeUEfe6rwfQi+iOeD2kCKwtPo7Uhw9ARj9bcZOI/VYtFQspIApjVUybZ/UspN1fbN5LVMJresMXV6qBFP1EfxiPXerlOX9R7kCgYBL9R2TDiEuvCznZeq/XZftpZCxKZ7FNlmv/7Tk71/e+lD/y3pXmVU3hL8rLZfYTHbnatBhsr9Uj5yaRN+GXAMpQa09iC7SpM5J4wc3jaNu8IJioMYuq16vspqlbpNBOBlaBosthXdXD/3LUdk5Xs4eLFbiQr2mHsU6bkPSggjw6QKBgFxPZBbyysvzCAYlmqZ/fRnNKaLurOO7BP1LVP8IAVZzuVHhrYld9DPWLpNxT0+/LjlAZlpIjfOXTX+geCKVNJtMfGcq4EJXPChUyy4Ps8OlR94Lyat3qh5wCn+0iBbcZavqMitNodL1zV1uYQw4cLT4l55akFL1fB1u3PQJsNpY";
    let genAuth = new signatureUtil();
    let signaturOauth = genAuth.generateOauthSignature(privateKey, req.headers["x-client-key"], req.headers["x-timestamp"]);
    // CONFIG
    const data = req.body;
    const headers = { 'headers' : 
      {
        'X-CLIENT-KEY' : req.headers["x-client-key"],
        'X-SIGNATURE' : signaturOauth
      }
    }
    //SEND
    axios.post('http://192.168.193.218:8066/open-api/v1.0/'+endpoint, data, headers)
    .then(function (response) {
    // handle success
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      const dataRes = {}
      dataRes.status = error.status;
      dataRes.message = error.message;
      res.json(dataRes);
    });

  }else{
    let oauth_token = req.headers.authorization != null ? req.headers.authorization.split(' ')[1] : '';
    let client_secret = "456";
    let body = req.body;
    let method = req.method;
    let url = req.url;
    let timeStamp = req.headers["x-timestamp"];
    let genAuth = new signatureUtil();
    let signatureApi = genAuth.generateServiceSignature(client_secret,method,url,oauth_token,timeStamp,body);
    const data = req.body;
    const headers = { 'headers' : 
      {
        'Origin' : "merchant.co.id",
        'Channel-id' : req.headers["channel-id"] != null ? req.headers["channel-id"] : '',
        'X-CLIENT-KEY' : req.headers["x-client-key"] != null ? req.headers["x-client-key"] : '',
        'X-TIMESTAMP' : req.headers["x-timestamp"] != null ? req.headers["x-timestamp"] : '',
        'X-PARTNER-ID' : req.headers["x-partner-id"] != null ? req.headers["x-partner-id"] : '',
        'X-EXTERNAL-ID' : req.headers["x-external-id"] != null ? req.headers["x-external-id"] : '',
        'X-SIGNATURE' : signatureApi,
        'Authorization' : oauth_token != null ? `Bearer ${oauth_token}` : ''
      }
    }
    //SEND
    axios.post('http://192.168.193.218:8066/open-api/v1.0/'+endpoint, data, headers)
    .then(function (response) {
    // handle success
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      const dataRes = {}
      dataRes.status = error.status;
      dataRes.message = error.message;
      res.json(dataRes);
    });
  } 

});

//TEST
app.post('/test/open-api/v1.0/*', (req, res) => {
  let endpoint = req.url.replace('/test/open-api/v1.0/','');
  if(endpoint == 'access-token/b2b'){
    let privateKey = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCugPTyjFhr4BCOGKT9WC4YV+JR/sZrc3F/+M6U0fLmqHIgqvnqP2VNUPzIrH1CbSxx4x+nuXILo83JCfKneNmPXgXn0WwgLhKbV20RNnbU4NX382j5jNWPR6j/XMy1KKb0dbq6RVRI+hdrbrXxcFu3AU3iqo6SN1xksayfkph2vtIaeNkp78oPJmwYc9BJlcBNcoNSlypTnrPHaS74B2W/+906t6brSZaDo9LLyLcU4jU1eCg0mh0P2FV8dm7xLCR6kEB8oKoN+QcvYK5Uq/M5VIeOkPodsALBn+WZq8QXz1L+eF3E3uxUvXbaPOWyxsTH7r8h38NHZBLrrPxzpBZbAgMBAAECggEBAJM0u+1kES8nPC/ygDQrT+8/K+9Jgi6gmy1+QR5voX2MuYHvWZWO1zEK0cOjJqODn0uPcmO134wMKYufNbCrFLSJd2fgVVssIowiiyJLFKFt7XIWRwbFFF6i7+BDc3ibC4QLUHLUC07okhsRsLA0vVm64u4EPPMBepKDA4E1VCJOXwY+KqWddL6mI1fhJ/jpy/Jk6+CmDpwmQBHksSH8YhNCO4v9J/jg3yDFIpO6b4nkm22nAYCJotiN3zpq2NRWq6L4MktwsOg4gS/Are7Hhn8+q9cpFY7sfbau9vNLiIFyh60DPmEj51bsYB9wWkFuNJfKlvzoslW7NofVMF8TXykCgYEA5P/UGc5KD+yghbA0SoY3GWicR/hjcUlJ7x0Ey7pJEo6aODdzCgATiL7UvkGISbufVuhWQQs5ddHvAGb5dsfmKKMDxWyr2VywBHktWm8S6tl5i4PhSbdxmdQmt8iKphgDS5osk9S31qYhS3fedpeWRrwvCsjlP0nTsPkZqGhqQCcCgYEAwxQ4V5j+D/wamddKgvFdtmtTwWw0t5lroNQ/sL+zvT+A0E/gkfG48N8Fb8kibeACclfra1CmC4GbVhxPAWE6BL5azY16CgdFylyB4cBtHYOTH2RjwQOGXG3QsFZIgpylwI5EikoV/ujqJKI+wNFitLk0LFF1xA1bNEMoW2Qs5K0CgYEAyI2VABS+oDuoSe0Lnsj0sHgBhrZuwORir9tGO/Yl0O66+cj2Iyf186jNQOK7rXd4EPDhuY1PAXSeUEfe6rwfQi+iOeD2kCKwtPo7Uhw9ARj9bcZOI/VYtFQspIApjVUybZ/UspN1fbN5LVMJresMXV6qBFP1EfxiPXerlOX9R7kCgYBL9R2TDiEuvCznZeq/XZftpZCxKZ7FNlmv/7Tk71/e+lD/y3pXmVU3hL8rLZfYTHbnatBhsr9Uj5yaRN+GXAMpQa09iC7SpM5J4wc3jaNu8IJioMYuq16vspqlbpNBOBlaBosthXdXD/3LUdk5Xs4eLFbiQr2mHsU6bkPSggjw6QKBgFxPZBbyysvzCAYlmqZ/fRnNKaLurOO7BP1LVP8IAVZzuVHhrYld9DPWLpNxT0+/LjlAZlpIjfOXTX+geCKVNJtMfGcq4EJXPChUyy4Ps8OlR94Lyat3qh5wCn+0iBbcZavqMitNodL1zV1uYQw4cLT4l55akFL1fB1u3PQJsNpY";
    let genAuth = new signatureUtil();
    let signaturOauth = genAuth.generateOauthSignature(privateKey, req.headers["x-client-key"], req.headers["x-timestamp"]);
    //Response
    res.json(
      {
        'headers' : 
        {
          'X-CLIENT-KEY' : req.headers["x-client-key"],
          'X-SIGNATURE' : signaturOauth
        }, 
        'body': req.body
      }
    );

  }else{
    let oauth_token = req.headers.authorization != null ? req.headers.authorization.split(' ')[1] : '';
    let client_secret = "456";
    let body = req.body;
    let method = req.method;
    let url = req.url;
    let timeStamp = req.headers["x-timestamp"];
    let genAuth = new signatureUtil();
    let signatureApi = genAuth.generateServiceSignature(client_secret,method,url,oauth_token,timeStamp,body);
    const data = req.body;
    res.json(
      {'headers' : 
        {
          'Origin' : "merchant.co.id",
          'Channel-id' : req.headers["channel-id"] != null ? req.headers["channel-id"] : '',
          'X-CLIENT-KEY' : req.headers["x-client-key"] != null ? req.headers["x-client-key"] : '',
          'X-TIMESTAMP' : req.headers["x-timestamp"] != null ? req.headers["x-timestamp"] : '',
          'X-PARTNER-ID' : req.headers["x-partner-id"] != null ? req.headers["x-partner-id"] : '',
          'X-EXTERNAL-ID' : req.headers["x-external-id"] != null ? req.headers["x-external-id"] : '',
          'X-SIGNATURE' : signatureApi,
          'Authorization' : oauth_token != null ? `Bearer ${oauth_token}` : ''
        },
        body: req.body
      }
    );
  } 

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});