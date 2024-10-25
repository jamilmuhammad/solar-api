import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "../../../common/database/base.entity";
import { SurveysEntity } from "./survey.entity";
import { SurveyLogsTypeEnum } from "../enums/survey-logs.type.enum";
import { SurveyLogPhotosEntity } from "./survey-log-photo.entity";

@Entity({
    name: 'survey_logs',
})
export class SurveyLogsEntity extends Base {

    @ManyToOne(() => SurveysEntity)
    @JoinColumn({ name: 'survey_id' })
    survey: SurveysEntity;

    @Column({ select: false, nullable: true })
    survey_id: number

    @Column({
        type: 'enum',
        enum: SurveyLogsTypeEnum,
    })
    type: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @OneToMany(() => SurveyLogPhotosEntity, o => o.log, { cascade: ['insert'] })
    photos: SurveyLogPhotosEntity[];

    constructor(partial: Partial<SurveyLogsEntity>) {
        super();
        Object.assign(this, partial);
    }
}