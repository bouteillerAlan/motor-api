import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(name);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const result = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}

