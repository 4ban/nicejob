const Scheduler = require("./index");

jest.mock("./index", () => {
  return jest.fn().mockImplementation(() => {
    return {
      delete: async (id) => {
        if (id === "wrong id") return new Error("wrong id");
        else return "Deleted";
      },
    };
  });
});
describe("Mock a class", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Scheduler.mockClear();
  });

  it("Check if the Scheduler class constructor have been called", () => {
    const scheduler = new Scheduler({
      project_id: "nicejob-scheduler",
      queue_id: "nicejob-queue",
    });
    expect(Scheduler).toHaveBeenCalledTimes(1);
  });

  it("Check if the jest mockClear() works", () => {
    expect(Scheduler).not.toHaveBeenCalled();
  });

  it("Check if the delete method with wrong id", async () => {
    const scheduler = new Scheduler({
      project_id: "nicejob-scheduler",
      queue_id: "nicejob-queue",
    });
    expect(await scheduler.delete("wrong id")).toEqual(new Error("wrong id"));
  });

  it("Check if the delete method with correct id", async () => {
    const scheduler = new Scheduler({
      project_id: "nicejob-scheduler",
      queue_id: "nicejob-queue",
    });
    expect(await scheduler.delete("correct id")).toEqual("Deleted");
  });
});
