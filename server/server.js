const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')


const app = express()

const webScraper = require('./web-scraper')
const writeScrapedDataToDb = require('./save-scrape')


// app.get('/authorized', function (req, res) {
//   res.send('Secured Resource');
// });

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))

const authRoutes = require('./routes/auth')
const billsRoutes = require('./routes/bills')
const billRoutes = require('./routes/bill')
const votesRoutes = require('./routes/votes')
const commentsRoutes = require('./routes/comments')

app.use('/auth', authRoutes)
app.use('/bills', billsRoutes)
app.use('/bill', billRoutes)
app.use('/votes', votesRoutes)
app.use('/comments', commentsRoutes)

app.get('/scrape', (req, res) => {
  webScraper(function (err, data) {
    if (err) {
      return console.log('Web Scraper Error')
    }
    res.send(data)
    writeScrapedDataToDb(data)
  })
})

// app.use('/bills', billsRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = app
