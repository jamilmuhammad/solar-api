import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "../../../common/database/base.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { FleetsEntity } from "../../fleets/entities/fleet.entity";
import { SurveyTypeEnum } from "../enums/survey.type.enum";
import { SurveyStatusEnum } from "../enums/survey.status.enum";
import { SurveyLogsEntity } from "./survey-log.entity";
import { IsBoolean, IsInt, IsOptional } from "class-validator";
import { SurveyLogsTypeEnum } from "../enums/survey-logs.type.enum";

@Entity({
    name: 'surveys',
})
export class SurveysEntity extends Base {

    @ManyToOne(() => LeadEntity)
    @JoinColumn({ name: 'survey_id' })
    survey: LeadEntity;

    @Column({ select: false, nullable: true })
    survey_id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'driver_id' })
    driver: UserEntity;

    @Column({
        select: false,
        nullable: true,
    })
    driver_id: number;

    /**
     * @deprecated Use survey entity instead
     */
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'customer_id' })
    customer: UserEntity;

    /**
     * @deprecated Use survey entity instead
     */
    @Column({
        select: false,
        nullable: true,
    })
    customer_id: number;

    /**
     * @deprecated Use survey entity instead
     */
    @ManyToOne(() => FleetsEntity)
    @JoinColumn({ name: 'fleet_id' })
    fleet: FleetsEntity;

    /**
     * @deprecated Use survey entity instead
     */
    @Column({
        select: false,
        nullable: true,
    })
    fleet_id: number;

    /**
     * @deprecated Use survey entity instead
     */
    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    start_date: Date;

    @Column({
        type: 'enum',
        enum: SurveyTypeEnum,
    })
    type: string;

    @Column({
        type: 'enum',
        enum: SurveyStatusEnum,
        default: SurveyStatusEnum.PENDING,
    })
    status: string;

    @Column({ type: 'bool', default: false })
    is_self_pickup: boolean;

    /**
     * @deprecated Use survey entity instead
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    address: string;

    @Column({
        type: 'double precision',
        nullable: true,
    })
    distance: number;

    @OneToMany(() => SurveyLogsEntity, o => o.survey)
    logs: SurveyLogsEntity[];

    @IsBoolean()
    @IsOptional()
    is_end_process: boolean;

    @IsInt()
    @IsOptional()
    progress_duration_second?: number;

    @IsOptional()
    related_surveys?: SurveysEntity[];

    @AfterLoad()
    setVirtualColumns() {
        this.is_end_process = this.status === SurveyStatusEnum.ON_PROGRESS || this.is_self_pickup;

        this.setDuration();
        this.handleDeprecatedData();
    }

    private handleDeprecatedData() {
        if (this.survey) {
            this.customer = this.survey.customer;
            this.customer_id = this.survey.customer_id;
            this.fleet = this.survey.fleet;
            this.fleet_id = this.survey.fleet_id;
            this.description = this.survey.description;

            this.setStartDateSurvey();
        }
    }

    private setStartDateSurvey() {
        this.start_date = this.survey.start_date;

        if (this.type === SurveyTypeEnum.PICK_UP) {
            this.start_date = this.survey.end_date;
        } else if (this.type === SurveyTypeEnum.DELIVERY) {
            this.start_date = this.survey.start_date;
        }
    }

    private setDuration() {
        if (!this.logs || this.status === SurveyStatusEnum.PENDING || this.logs.length === 0) {
            this.progress_duration_second = null;
            return;
        }

        const start = this.logs.find(o => o.type === SurveyLogsTypeEnum.START);
        const end = this.logs.find(o => o.type === SurveyLogsTypeEnum.END);

        if (!start) {
            this.progress_duration_second = null;
            return;
        }

        if (!end) {
            this.progress_duration_second = Math.floor((new Date().getTime() - start.created_at.getTime()) / 1000);
            return;
        }

        this.progress_duration_second = Math.floor((end.created_at.getTime() - start.created_at.getTime()) / 1000);
    }

    constructor(partial: Partial<SurveysEntity>) {
        super();
        Object.assign(this, partial);
    }
}