import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* create a user */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  /* find a user by it's id */
  @Get(":id")
  findOne(@Param("id") id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  /* update a user by it's id */
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersService.update(id, updateUserDto);
  }

  /* delete a user by it's id */
  @Delete(":id")
  remove(@Param("id") id: string): Promise<DeleteResult> {
    return this.usersService.remove(id);
  }
}
