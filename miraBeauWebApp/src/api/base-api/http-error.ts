export class HttpError extends Error {

  statusCode: number;

  constructor(msg: string, statusCode: number) {
    super(msg);
    this.message = msg;
    this.statusCode = statusCode;
  }

}
