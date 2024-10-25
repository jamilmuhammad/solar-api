import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "../../../common/database/base.entity";
import { UserEntity } from "./user.entity";
import { UserTokenReason } from "../enums/user.token-reason.enum";

@Entity({
    name: 'user_tokens',
})
export class UserTokenEntity extends Base {

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ select: false, nullable: true })
    user_id: number;

    @Column()
    token: string;

    @Column()
    expired_at: Date;

    @Column({
        type: 'enum',
        enum: UserTokenReason,
    })
    reason: UserTokenReason;

    constructor(partial: Partial<UserTokenEntity>) {
        super();
        Object.assign(this, partial);
    }
}