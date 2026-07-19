import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Payload } from "./auth.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(name: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(name);

    let passValid = false;
    try {
      passValid = await bcrypt.compare(pass, user.password);
    } catch {
      throw new InternalServerErrorException("pass check error");
    }

    if (!passValid) {
      throw new UnauthorizedException();
    }

    const payload: Payload = { sub: user.id, name: user.name };
    let jwt: string;
    try {
      jwt = await this.jwtService.signAsync(payload);
    } catch {
      throw new InternalServerErrorException("jwt generation error");
    }

    return { access_token: jwt };
  }
}
