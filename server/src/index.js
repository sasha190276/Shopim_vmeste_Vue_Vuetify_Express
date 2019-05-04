const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./db');

const config = require('./config/config');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(require('./routes/headers_sample'));
app.use(require('./routes/import_purchase'));
app.use(require('./routes/users'));


app.get('/posts', (req, res) => {
  res.send(
    [{
      title: 'Hello World!',
      description: 'Hi there! How are you?',
    }],
  );
});

db.connect(config.dbURL, (err) => {
  if (err) {
    console.log('Unable to connection to Mongo.');
  } else {
    app.listen(process.env.PORT || config.port,
      () => console.log(`Server start on port ${config.port} ...`));
  }
});
