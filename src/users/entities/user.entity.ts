import { BaseEntity } from "src/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  password: string;
}
