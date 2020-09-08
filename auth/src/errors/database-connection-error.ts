export class DatabaseConnectionError extends Error {
  status = 500;
  reason = `Error connecting database`;
  constructor() {
    super();

    //
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
