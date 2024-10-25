import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "../../../common/database/base.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({
    name: 'device_tokens',
})
export class DeviceTokensEntity extends Base {

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ select: false })
    user_id: number;

    @Column()
    token: string;

    constructor(partial: Partial<DeviceTokensEntity>) {
        super();
        Object.assign(this, partial);
    }
}