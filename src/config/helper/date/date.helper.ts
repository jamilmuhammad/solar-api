import * as moment from "moment";

export class DateHelper {

    static getJakartaMoment(date: string): moment.Moment {
        return moment(date).utcOffset('+0700');
    }

    static format(date: Date, format: string): string {
        return moment(date).format(format);
    }

    static addDays(date: Date, days: number): Date {
        return moment(date).add(days, 'days').toDate();
    }

    static addMonths(date: Date, months: number): Date {
        return moment(date).add(months, 'months').toDate();
    }

    static addDaysMoment(moment: moment.Moment, days: number): moment.Moment {
        return moment.add(days, 'days');
    }

    static getWeekendDays(start: moment.Moment, duration: number) {
        const dateRange = [];

        if (start.day() === 0 || start.day() === 6) {
            dateRange.push(start);
        }

        if (dateRange.length != 0 && duration == 1) {
            return dateRange;
        }

        for (let i = 1; i < duration + 1; i++) {
            const end = moment(start).add(i, 'day');
            if (end.day() === 0 || end.day() === 6) {
                dateRange.push(end);
            }
        }
        return dateRange;
    }
}