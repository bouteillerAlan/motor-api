import { BadRequestException } from "@nestjs/common";
import { isUUID } from "class-validator";

/**
 * Check if a given value is a valid uuid whatever the version or throw a BadRequestException
 * @param {string} value - the value to test
 */
export function isAValidUUIDOrThrow(value: string): void {
  if (!isUUID(value)) {
    throw new BadRequestException("uuid expected");
  }
}
