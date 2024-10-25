import { Base } from "src/common/database/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { OrderEntity } from "./lead.entity";
import { OrderApprovalStatusEnum } from "../enums/order.status.enum";

@Entity({
    name: 'order_status_logs',
})
export class OrderStatusLogsEntity extends Base {

    constructor(partial: Partial<OrderStatusLogsEntity>) {
        super();
        Object.assign(this, partial);
    }

    @ManyToOne(() => OrderEntity)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @Column()
    order_id: number;

    @Column({
        type: 'enum',
        enum: OrderApprovalStatusEnum,
        default: OrderApprovalStatusEnum.PENDING,
    })
    status: OrderApprovalStatusEnum;

    @Column({
        nullable: true,
        type: 'text',
    })
    description: string;
}
