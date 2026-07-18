import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { DeleteResult, Repository } from "typeorm";
import { isUUID } from "class-validator";
import { UpdateResult } from "typeorm/browser";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  /* check if a user name already exist in the db */
  private async userNameExist(name: string): Promise<boolean> {
    return this.repo.exists({ where: { name } });
  }

  /* create a new user, check for name uniqueness */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const exist = await this.userNameExist(createUserDto.name);
    if (exist) {
      throw new BadRequestException("user already exist");
    }
    const newUser = this.repo.create(createUserDto);
    return this.repo.save(newUser);
  }

  /* find one user by it's id */
  async findOne(id: string): Promise<UserEntity> {
    if (!isUUID(id)) {
      throw new BadRequestException("uuid expected");
    }
    return this.repo.findOne({ where: { id: id } });
  }

  /* update a user by it's id */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.repo.update(id, updateUserDto);
  }

  /* remove a user by it's id */
  remove(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
