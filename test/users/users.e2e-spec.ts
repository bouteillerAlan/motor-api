import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";
import { Repository } from "typeorm";
import { UserEntity } from "../../src/users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { setupApp } from "../../src/setupApp";

interface UserResponse {
  id: string;
  name: string;
  password?: string;
}

describe("UsersController (e2e)", () => {
  let app: INestApplication<App>;
  let userRepo: Repository<UserEntity>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    setupApp(app);
    userRepo = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await app.init();
  });

  afterEach(async () => {
    await userRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/users (POST) creates a user", async () => {
    const req = request(app.getHttpServer()).post("/users");
    const res = await req.send({ name: "Bob", password: "12345678" }).expect(201);
    const body = res.body as UserResponse;
    expect(body.name).toBe("Bob");
    expect(body.password).toBeUndefined();
  });
});
