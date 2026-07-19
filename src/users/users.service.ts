import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { DeleteResult, Repository } from "typeorm";
import { UpdateResult } from "typeorm/browser";
import bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
  ) {}

  /* check if a user name already exist in the db */
  private async userNameExist(name: string): Promise<boolean> {
    return this.repo.exists({ where: { name } });
  }

  /* hash a string */
  private async hashString(value: string): Promise<string> {
    try {
      return bcrypt.hash(value, this.configService.get("SALT_ROUND"));
    } catch {
      throw new InternalServerErrorException("hashing error");
    }
  }

  /* create a new user, check for name uniqueness */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const exist = await this.userNameExist(createUserDto.name);
    if (exist) {
      throw new BadRequestException("user already exist");
    }

    const hashPass = await this.hashString(createUserDto.password);
    const newUser = this.repo.create({ ...createUserDto, password: hashPass });
    return this.repo.save(newUser);
  }

  /* find one user by it's id */
  async findOne(id: string): Promise<UserEntity> {
    return this.repo.findOne({ where: { id: id } });
  }

  /* update a user by it's id */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const updatedUser = updateUserDto;
    if (updateUserDto.password) {
      updatedUser.password = await this.hashString(updateUserDto.password);
    }
    return this.repo.update(id, updatedUser);
  }

  /* remove a user by it's id */
  remove(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
