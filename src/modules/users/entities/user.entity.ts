import { Base } from "../../../common/database/base.entity";
import { AfterLoad, Column, Entity, Index, OneToMany } from "typeorm";
import { UserRoleEnum } from "../enums/user.role.enum.ts";
import { USER_EMAIL_UNIQUE_INDEX } from "src/common/constant/db-index.key.constant";
import { PhoneNumberHelper } from "../../../config/helper/string/phone-number.helper";

@Entity({
    name: 'users',
})
export class UserEntity extends Base {

    @Column()
    name: string;

    @Column({ nullable: true, select: false })
    @Index(USER_EMAIL_UNIQUE_INDEX, { unique: true, where: 'deleted_at IS NULL' })
    email: string;

    @Column({ nullable: true, select: false })
    phone_number?: string;

    @Column({ nullable: true, select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.CUSTOMERSERVICE,
    })
    role: UserRoleEnum;

    @AfterLoad()
    afterLoad() {
        if (this.phone_number) {
            this.phone_number = PhoneNumberHelper.replacePrefix(this.phone_number);
        }
    }

    constructor(partial: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }
}