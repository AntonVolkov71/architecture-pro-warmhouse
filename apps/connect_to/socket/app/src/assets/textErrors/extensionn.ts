import { HttpStatus } from "@nestjs/common";

export type ResponseProcessingDataExtension = {
  response: "ok" | "bad_request" | "not_found";
  httpStatus: HttpStatus;
};

export const errorBadRequest: ResponseProcessingDataExtension = {
  response: "bad_request",
  httpStatus: HttpStatus.BAD_REQUEST
};