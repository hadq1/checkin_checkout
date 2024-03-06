# CHECKIN-CHECKOUT

## Setup

```shell
npm i
```

## Deploy

Set up cron jobs using the following format:

```shell
0 2 * * * cd /path/to/checkin-checkout && /path/to/node main.js in
0 10 * * * cd /path/to/checkin-checkout && /path/to/node main.js out
```

Make sure to replace `/path/to/checkin-checkout` with the absolute path to your `checkin-checkout` folder and `/path/to/node`
with the absolute path to your Node.js executable.

Remember to consider the timezone of your server when setting up cron jobs.