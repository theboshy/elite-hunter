var express = require('express') , logger = require('morgan') , app = express(), path    = require("path");

app.use(logger('dev'))
app.use("/sources/",express.static(__dirname + '/source/public/'))


app.get('/hunt', function (req, res, next) {
  try {
    //var html = template({ title: 'Home' })
    res.sendFile(path.join(__dirname,'/source/pages/template/index.html'))
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 1010, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 1010))
})
