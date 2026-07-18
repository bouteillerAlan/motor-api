import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../src/users/entities/user.entity";
import { UsersService } from "../../src/users/users.service";
import { Repository } from "typeorm";

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
});

describe("UsersService", () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(UserEntity), useFactory: mockRepo }],
    }).compile();

    service = module.get(UsersService);
    repo = module.get(getRepositoryToken(UserEntity));
  });

  it("should create a user", async () => {
    const dto = { name: "Alice", password: "1234" };
    repo.create.mockReturnValue(dto as UserEntity);
    repo.save.mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000", ...dto } as UserEntity);

    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should find one user", async () => {
    repo.findOne.mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000", name: "Alice" } as UserEntity);
    const result = await service.findOne("550e8400-e29b-41d4-a716-446655440000");
    expect(result?.name).toBe("Alice");
  });

  it("should throw if user not found", async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne("6f9619ff-8b86-d011-b42d-00c04fc964ff")).rejects.toThrow();
  });
});
