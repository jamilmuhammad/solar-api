export class QueryHelper {
    static appendSelect(builder: any, fields: string[]) {
        fields.forEach(field => {
            builder.addSelect(field);
        });
    }
}