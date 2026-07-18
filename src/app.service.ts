import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    const now = new Date().toISOString();
    return now;
  }
}
