import { SelectQueryBuilder } from "typeorm";

export class PaginationHelper {

    static async pagination<T>(builder: SelectQueryBuilder<T>, options: Partial<PaginationHelperOptions>): Promise<Pagination<T>> {
        const offset = options.offset ?? (options.page - 1) * options.limit;

        builder.skip(offset);
        builder.take(options.limit);

        const items = await builder.getMany();
        const total_items = await builder.getCount();

        const current_page = Number(options.page);
        const total_page = Math.ceil(total_items / options.limit);
        const next_page = current_page === total_page || total_page === 0 || current_page > total_page ? null : current_page + 1;

        const pagination = options.offset ? undefined : {
            current_page,
            total_page,
            next_page,
        };

        return new Pagination(
            items,
            {
                total_items,
                item_count: items.length
            },
            pagination,
        )
    }
}

export class PaginationHelperOptions {
    page?: number;
    limit: number;
    offset?: number;
}

export class Pagination<T> {
    constructor(
        readonly items: T[],
        readonly meta: {
            total_items: number;
            item_count: number;
        },
        readonly pagination?: {
            current_page: number;
            total_page: number;
            next_page?: number;
        },
    ) { }
}