const { CloudTasksClient } = require("@google-cloud/tasks");

module.exports = class Scheduler {
  /**
   * Creates an instance of Scheduler.
   * @param {*} { project_id, queue_id }
   */
  constructor({ project_id, queue_id }) {
    this.project_id = project_id;
    this.queue_id = queue_id;
    this.location = "us-central1";
    this.client = new CloudTasksClient();
    this.parent = this.client.queuePath(
      this.project_id,
      this.location,
      this.queue_id
    );
  }
  /**
   * @description Method for checking the date
   * @param {*} date
   * @returns {string} seconds
   */
  dateCheck(date) {
    return date ? date.getTime() / 1000 : 0;
  }
  /**
   * @description Creates a task and put into the queue.
   * @param {*} { date, request }
   * @returns {string} task ID or Error instance
   */
  async schedule({ date, request }) {
    if (!request || request.constructor !== Object)
      throw new Error("request object is required");
    if (!request.url) throw new Error("url is required");
    if (
      !request.headers ||
      (Object.keys(request.headers).length === 0 &&
        request.headers.constructor === Object)
    )
      request.headers = { "Content-Type": "application/json" };

    const task = {
      httpRequest: {
        httpMethod: request.method ? request.method : "POST",
        url: request.url,
      },
    };

    task.httpRequest.headers = request.headers;
    task.scheduleTime = {
      seconds: this.dateCheck(date),
    };

    if (["PUT", "POST", "PATCH"].includes(task.httpRequest.httpMethod)) {
      if (!request.body) throw new Error("body is required");
      task.httpRequest.body = Buffer.from(request.body.toString("base64"));
    }
    const httpRequest = { parent: this.parent, task };
    try {
      const [response] = await this.client.createTask(httpRequest);
      return response.name;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description Delete a task from the queue
   * @param {*} id
   * @returns {string} Success message or Error instance
   */
  async delete(id) {
    try {
      await this.client.deleteTask({ name: id });
      return "Successfully deleted";
    } catch (error) {
      throw new Error(error);
    }
  }
};
