import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "../../../common/database/base.entity";
import { SurveyLogsEntity } from "./survey-log.entity";

@Entity({
    name: 'request_log_photos',
})
export class SurveyLogPhotosEntity extends Base {

    @ManyToOne(() => SurveyLogsEntity)
    @JoinColumn({ name: 'log_id' })
    log: SurveyLogsEntity;

    @Column({ select: false, nullable: true })
    log_id: string

    @Column()
    photo: string;

    constructor(partial: Partial<SurveyLogPhotosEntity>) {
        super();
        Object.assign(this, partial);
    }
}