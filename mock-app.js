/**
 * MOCK API
 * ALSO SERVING AS COMPLETE MOCK APPLICATION (push to CloudFoundry)
 */
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8007;
const stubRootDirectory = process.cwd();

// STUB AND MOCK DATA
const iataAvailableMocks = ['DPS', 'LAX', 'SVO'];
const mockedTimer = 400;

let connectionCounter = 1;

function loadStubResult(file) {
  return JSON.parse(fs.readFileSync(stubRootDirectory + '/internals/stubs/' + file, { encoding: 'utf8' }));
}

// Static content (output of 'npm run build', when deployed whole package)
app.use(express.static('./dist/destination/'));

// Same endpoint as real Java Flux one
app.get('/offers/:origin', (req, res) => {

  let origin = req.params.origin ? req.params.origin.toUpperCase() : 'DPS';

  if (iataAvailableMocks.indexOf(origin) === -1) {
    origin = 'DPS';
  }

  const data = loadStubResult(`mock-data-${origin}.json`);
  const destinations = data.length;
  const thisConnection = connectionCounter++;
  let thisEvent = 1;

  console.log(`Client connected to event stream (connection #${thisConnection}) for origin ${origin}`);

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  const ticker = setInterval(() => {
      const id = thisConnection * 1000 + thisEvent;
      const eventData = data[Math.floor(Math.random() * destinations)];

      // MOCK PRICE BY RANDOMLY PICKING ONE
      eventData.fare = Math.floor(Math.random() * 900) + 100;

      const sendData = JSON.stringify(eventData);

      // res.write('event: my-event\n');
      res.write('id: ' + id + '\n');
      res.write('data: ' + sendData + '\n\n');

      thisEvent++;

  }, mockedTimer);

  req.on('close', () => {
      console.log('Client disconnected from event stream (connection #' + thisConnection + ')');
      res.end();
      clearInterval(ticker);
  });
});

// Support pushstate (asuming not found entries are states)
app.get('*', (req, res) => {
  res.sendFile(stubRootDirectory + '/dist/index.html');
});

app.listen(port);

console.log('Listening on port ' + port);
