import { INestApplication, ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { log } from "console";

/* we use that to be able to use it on prod app and also on test easily */
export function setupApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
  // force the password field to be remove before any request response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  log(`env: ${process.env.NODE_ENV}`);
}
