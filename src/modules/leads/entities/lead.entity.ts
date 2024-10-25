import { Base } from "../../../common/database/base.entity";
import { FleetsEntity } from "../../fleets/entities/fleet.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { InsuranceEntity } from "../../insurances/entities/insurances.entity";
import { IsNumber, IsOptional } from "class-validator";
import { RequestsEntity } from "../../surveys/entities/survey.entity";
import { LeadApprovalStatusEnum, LeadStatusEnum } from "../enums/lead.status.enum";
import { LeadStatusLogsEntity } from "./lead-status-logs.entity";
import { RequestTypeEnum } from "../../surveys/enums/survey.type.enum";
import { LeadRequestStatusEnum } from "../enums/lead.request-status.enum";
import { RequestStatusEnum } from "src/modules/surveys/enums/survey.status.enum";
import { UserStatusEnum } from "../../users/enums/user.status.enum";
import { LeadAdditionalItems } from "../interface/lead-additionals.interface";
import { RequestLogsTypeEnum } from "src/modules/surveys/enums/survey-logs.type.enum";

@Entity({
    name: 'leads',
})
export class LeadEntity extends Base {

    @Column()
    invoice_number: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ManyToOne(() => FleetsEntity)
    @JoinColumn({ name: 'fleet_id' })
    fleet: FleetsEntity;

    @Column({ select: false })
    fleet_id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'customer_id' })
    customer: UserEntity;

    @Column({ select: false })
    customer_id: number;

    @Column({
        type: 'timestamptz'
    })
    start_date: Date;

    @Column({
        type: 'int',
    })
    duration: number;

    @Column({
        type: 'enum',
        enum: LeadPaymentStatusEnum,
        default: LeadPaymentStatusEnum.PENDING,
    })
    payment_status: LeadPaymentStatusEnum;

    @Column({
        type: 'enum',
        enum: LeadApprovalStatusEnum,
        default: LeadApprovalStatusEnum.PENDING,
    })
    status: LeadApprovalStatusEnum;

    @ManyToOne(() => InsuranceEntity)
    @JoinColumn({ name: 'insurance_id' })
    insurance: InsuranceEntity;

    @Column({ select: false, nullable: true })
    insurance_id: number;

    @OneToMany(() => LeadStatusLogsEntity, log => log.lead, { cascade: ['insert'] })
    status_logs: LeadStatusLogsEntity[];

    @Column({
        type: 'double precision',
        nullable: true,
    })
    service_price: number;

    @Column({
        type: 'double precision',
        nullable: true,
    })
    out_of_town_price: number;

    @Column({
        type: 'jsonb',
        nullable: true,
    })
    additional_services: LeadAdditionalItems[];

    @Column({
        type: 'double precision',
        nullable: true,
    })
    driver_price: number;

    @Column({
        type: 'double precision',
        default: 0,
    })
    sub_total_price: number;

    @Column({
        type: 'double precision',
        default: 0,
    })
    total_tax: number;

    /**
     * Discount in percentage
     */
    @Column({
        type: 'double precision',
        default: 0,
    })
    discount: number;

    @Column({
        type: 'double precision',
        default: 0,
    })
    total_price: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    payment_link: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    payment_pdf_url: string;

    @Column({
        nullable: true,
    })
    external_id: string;

    @IsNumber()
    discount_amount: number;

    @IsOptional()
    end_date?: Date;

    @OneToMany(() => RequestsEntity, request => request.lead, { cascade: ['insert'] })
    requests: RequestsEntity[];

    @IsOptional()
    start_request?: RequestsEntity;

    @IsOptional()
    end_request?: RequestsEntity;

    @IsOptional()
    survey_status: LeadRequestStatusEnum;

    @IsOptional()
    lead_status: LeadStatusEnum;

    constructor(partial: Partial<LeadEntity>) {
        super();
        Object.assign(this, partial);
    }
}
