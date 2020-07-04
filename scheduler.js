// Since the package is not uploaded to the NPM registry
// I use the import of the index file directly
// const Scheduler = require("@nicejob/nicejob-scheduler");
const Scheduler = require("./index");

const project_id = "nicejob-scheduler";
const queue_id = "nicejob-queue";

const scheduler = new Scheduler({
  project_id,
  queue_id,
});

// Schedule a task
const date = new Date("2020-07-07T01:50:00");
const request = {
  url: "https://api.nicejob.co/v2/process",
  headers: {
    Authorization: "Bearer faketoken",
  },
  body: {
    id: 123,
    metadata: { foo: "bar" },
  },
};

// (async () => {
//   try {
//     const task_id = await scheduler.schedule({ date, request });
//     console.log("ID of the task: ", task_id);
//   } catch (error) {
//     console.error(error);
//   }
// })();

//Delete a task

// (async () => {
//   const task_id =
//     "projects/nicejob-scheduler/locations/us-central1/queues/nicejob-queue/tasks/2112618861855851279";
//   try {
//     const response = await scheduler.delete(task_id);
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// })();
