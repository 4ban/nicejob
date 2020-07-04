const Scheduler = require("./index");

describe("Test the class methods for real", () => {
  let scheduler;
  let task_id;
  beforeAll(() => {
    scheduler = new Scheduler({
      project_id: "nicejob-scheduler",
      queue_id: "nicejob-queue",
    });
  });

  it("Check if the scheduler has required data", () => {
    expect(scheduler.project_id).toEqual("nicejob-scheduler");
    expect(scheduler.queue_id).toEqual("nicejob-queue");
    expect(scheduler.location).toEqual("us-central1");
  });

  it("Check the dateCheck method with the date", () => {
    expect(scheduler.dateCheck(new Date("2020-07-07T01:50:00"))).toEqual(
      1594111800
    );
  });

  it("Check the dateCheck method with the empty date", () => {
    expect(scheduler.dateCheck("")).toEqual(0);
  });

  it("Check schedule method with the correct parameters", async () => {
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

    try {
      task_id = await scheduler.schedule({ date, request });
      expect(task_id).toContain("nicejob-queue");
    } catch (error) {}
  });
  it("Check delete method with wrong or not existed id", async () => {
    try {
      const response = await scheduler.delete(
        "projects/nicejob-scheduler/locations/us-central1/queues/nicejob-queue/tasks/26267404562693855711"
      );
    } catch (error) {
      expect(error.name).toContain("Error");
    }
  });

  it("Check delete method with correct id", async () => {
    try {
      const response = await scheduler.delete(task_id);
      expect(response).toContain("Successfully deleted");
    } catch (error) {}
  });

  it("Check schedule method with the incorrect parameters: no request", async () => {
    const date = new Date("2020-07-07T01:50:00");
    const request = "";

    try {
      task_id = await scheduler.schedule({ date, request });
    } catch (error) {
      expect(error.message).toContain("request object is required");
    }
  });

  it("Check schedule method with the incorrect parameters: no url", async () => {
    const date = new Date("2020-07-07T01:50:00");
    const request = {
      headers: {
        Authorization: "Bearer faketoken",
      },
      body: {
        id: 123,
        metadata: { foo: "bar" },
      },
    };

    try {
      task_id = await scheduler.schedule({ date, request });
    } catch (error) {
      expect(error.message).toContain("url is required");
    }
  });

  it("Check schedule method with the incorrect parameters: no body with POST method", async () => {
    const date = new Date("2020-07-07T01:50:00");
    const request = {
      url: "https://api.nicejob.co/v2/process",
      headers: {
        Authorization: "Bearer faketoken",
      },
    };

    try {
      task_id = await scheduler.schedule({ date, request });
    } catch (error) {
      expect(error.message).toContain("body is required");
    }
  });
});
