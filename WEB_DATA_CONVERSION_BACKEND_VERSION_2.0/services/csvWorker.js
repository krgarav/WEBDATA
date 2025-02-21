const { Worker } = require("bullmq");
const csvUpdateTask = require("../controllers/CompareCsv/csvUpdate"); // Extracted update logic

new Worker(
    "csvUpdateQueue",
    async (job) => {
        console.log(`Processing job: ${job.id}`);
        await csvUpdateTask(job.data);
    },
    { connection: { host: "127.0.0.1", port: 6379 } }
);
