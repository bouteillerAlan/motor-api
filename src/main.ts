import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { log } from "console";

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // force the password field to be remove before any request response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  log(`env: ${process.env.NODE_ENV}`);
  await app.listen(3000);
}
bootstrap();
