//
// Christophe Hamerling
// @chamerling
//
var express = require('express')
  , play = require('ow2-playclient');

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

var path = '/subcriber';
var host = 'localhost';
var port = 3000;
var me = 'http://' + host + ':' + port + path;
var nb = 0;
var subscription_id = null;

// TODO : parameter!
var token = 'dd2f852e8ca0f9e17b8d1f4c8a5a8848';

// TODO : Get it from input or from the API
var stream = 'http://streams.event-processing.org/ids/activityEvent#stream';

var client = play.create({token: token});

app.post(path, function(req, res) {
  console.log('Got an input message:', req.body);
  nb++;
  res.send(200);
});

app.get('/', function(req, res) {
  res.json({notifications: nb, listener: me, subscription: subscription_id, uptime:process.uptime()});
});

app.get('/current', function(req, res) {
  if (!subscription_id) {
    res.send(500);
  } else {
    client.subscriptions().get(subscription_id, function(err, result) {
      if (err) {
        res.send(500, err);
      } else {
        result.info = 'You can unsubscribe with an HTTP GET at ' + 'http://' + host + ':' + port + '/' + subscription_id;
        res.json(result);
      }
    });
  }
});

app.get('/subscriptions', function(req, res) {
  client.subscriptions().all(function(err, result) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(result);
    }
  });
});

app.listen(port, function(err) {
  console.log('Listening on port', port);
  
  var subscription = {
    resource : stream,
    subscriber : me
  }
  
  client.subscriptions().create(subscription, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      subscription_id = result.subscription_id;
      console.log('Subscription ID is', subscription_id);
      
      app.get('/' + subscription_id, function(req, res) {
        client.subscriptions().delete(subscription_id, function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(200);
          }
        });
      });
      
      process.on('SIGINT', function() {
        console.log('Delete subcription', subscription_id);
        
        if (!subscription_id) {
          process.exit();
        } else {
          client.subscriptions().delete(subscription_id, function(err, result) {
            if (err) {
              console.log('Unsubscribe error');
            } else {
              console.log('Deleted!')
            }
            process.exit();
          });
        }
      });
      
      // unsubscribe on exit...
      process.on('exit', function() {
        console.log('Bye!')
      });
    }
  })
});