import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, ValidateIf } from "class-validator";

export enum GetOrdersStatus {
    PENDING = 'pending',
    ON_PROGRESS = 'on_progress',
    DONE = 'done',
}

enum OrderColumn {
    ID = 'id',
    TOTAL_PRICE = 'total_price',
}

export class GetOrderPaginationDto {

    @ApiProperty({ default: 1 })
    page: number = 1;

    @ApiProperty({ default: 10 })
    @ValidateIf((o) => o.limit)
    limit: number = 10;

    @ApiProperty({ nullable: true, required: false })
    q?: string;

    @ApiProperty({
        nullable: true,
        required: false,
        enum: GetOrdersStatus,
    })
    status?: GetOrdersStatus;

    @ApiProperty({
        nullable: true,
        required: false,
        type: 'date',
    })
    @IsDateString()
    @ValidateIf((o) => o.start_date)
    start_date?: string;

    @ApiProperty({
        nullable: true,
        required: false,
        type: 'date',
    })
    @IsDateString()
    @ValidateIf((o) => o.end_date)
    end_date?: string;

    @ApiProperty({
        nullable: true,
        required: false,
        enum: ['ASC', 'DESC'],
    })
    @IsEnum(['ASC', 'DESC'])
    @ValidateIf((o) => o.order_by)
    order_by: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({
        nullable: true,
        required: false,
        enum: OrderColumn,
    })
    @IsEnum(OrderColumn)
    @ValidateIf((o) => o.order_column)
    order_column: OrderColumn = OrderColumn.ID;

    constructor(data) {
        Object.assign(this, data);
    }
}