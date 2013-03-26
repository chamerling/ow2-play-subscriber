# OW2 Play Subscriber

Node.js server which subscribes to the Play Event Platform and receives notications when messages are published into the right resource.

## Howtos

Install and start the runtime:

    npm install
    node index.js

and check these URLs

- http://localhost:3000 : General information as JSON
- http://localhost:3000/subscriptions : Get all the current user subscriptions
- http://localhost:3000/current : The current subscription information
- http://localhost:3000/{id} : Will send an unsubscribe to the platform

Killing the server will send an unsubscribe to the platform...

@chamerling