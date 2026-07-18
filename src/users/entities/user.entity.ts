import { Exclude } from "class-transformer";
import { BaseEntity } from "src/base.entity";
import { Column, Entity } from "typeorm";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;
}
