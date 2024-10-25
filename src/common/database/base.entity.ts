import { BaseEntity, CreateDateColumn, DeleteDateColumn, Generated, PrimaryColumn, UpdateDateColumn, ValueTransformer } from "typeorm";

export const bigint: ValueTransformer = {
    to: (entityValue: number) => entityValue,
    from: (databaseValue: string): number => Number(databaseValue)
}
export class Base extends BaseEntity {

    @Generated('increment')
    @PrimaryColumn('bigint', {
        transformer: bigint,
    })
    id: number;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at'
    })
    updated_at: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        select: false,
    })
    deleted_at: Date;
}