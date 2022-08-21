var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var faker = require('faker');
faker.locale = 'de'

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const _host = '127.0.0.1';
const _port = '3000';
const _testRecordsCount = 100;
const _promotionFilePath = "./promotions.json";

// Get promotions from generated JSON file
// todo - Validate input params
// todo - Filter by params & queries on serverside
app.get('/api/v1/promotions/priceoffers/ond/:origin/:destination', async function (req, res) {
  const queries = req.query;
  const params = req.params;
  fs.readFile( __dirname + "/" + _promotionFilePath, 'utf8', function (err, data) {
    res.end(data)
  });
});

// Generate test records
app.get('/api/v1/generate-promotion-json', async function (req, res) {
  const promotions = [];
  for (let i = 1; i <= _testRecordsCount ;i++) {
    promotions.push({
      origin: faker.random.arrayElement(['Berlin', 'Hamburg', 'Munich']),
      destination: faker.random.arrayElement(['Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund']),
      departureDate: faker.date.future(),
      returnDate: faker.date.future(),
      seatAvailability: faker.mersenne.rand(0, 10),
      price: {
        amount: faker.commerce.price(10, 500),
        currency: 'EUR'
      },
      offerType: faker.random.word(),
      uuid: faker.random.uuid(),
    });
  }
  fs.writeFileSync(_promotionFilePath, JSON.stringify(promotions));
  res.end('Done!');
});

// Run Server
var server = app.listen(_port, function () {
   console.log("Example app listening at http://%s:%s", _host, _port)
})