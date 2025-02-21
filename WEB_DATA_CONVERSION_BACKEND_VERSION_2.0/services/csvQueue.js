const { Queue } = require("bullmq");

const csvQueue = new Queue("csvUpdateQueue", {
    connection: { host: "127.0.0.1", port: 6379 }
});

module.exports = csvQueue;
