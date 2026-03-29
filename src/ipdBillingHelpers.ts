import moment from 'moment';
import type { IpdFacilityBed, IpdFacilityRoom } from './ipdBillingTypes';

/** Same localStorage key as Stetho `store/localstorage` (`LS_IPD_CONFIG`). */
const LS_IPD_CONFIG = 'ipd-conf';

export interface IpdConfigFromStorage {
    beds?: IpdFacilityBed[] | null;
    rooms?: IpdFacilityRoom[] | null;
}

export const getIpdConfig = (): IpdConfigFromStorage | undefined => {
    try {
        return JSON.parse(localStorage.getItem(LS_IPD_CONFIG) || '{}') as IpdConfigFromStorage;
    } catch {
        return undefined;
    }
};

export const formattedNumber = (n: number): string => n.toLocaleString('en-IN');

const calculateAge = (
    dob: string,
    visitDate?: string,
): { age: string; month: string; day: string } => {
    const today = visitDate ? moment(new Date(visitDate)) : moment(new Date());
    const dobInMoment = moment(dob);
    const years = today.diff(dobInMoment, 'year');
    dobInMoment.add(years, 'years');
    const months = today.diff(dobInMoment, 'months');
    dobInMoment.add(months, 'months');
    const days = today.diff(dobInMoment, 'days');
    return { age: years.toString(), month: months.toString(), day: days.toString() };
};

const parseAge = (
    a: {
        age?: string | null;
        month?: string | null;
        dob?: string | null;
        ageInYear?: string | null;
        ageInMonths?: string | null;
    },
    visitDate?: string,
) => {
    let aa: string | undefined;
    let am: string | undefined;
    let ad: string | undefined;

    if (a.dob) {
        const temp = calculateAge(a.dob, visitDate);
        aa = temp.age;
        am = temp.month;
        ad = temp.day;
    } else {
        aa = a.age || a.ageInYear || undefined;
        am = a.month || a.ageInMonths || undefined;
    }

    const ageInt = parseInt(aa || '0', 10);
    const ageMonthInt = parseInt(am || '0', 10);
    const ageDayInt = parseInt(ad || '0', 10);

    return { aa, am, ad, ageInt, ageMonthInt, ageDayInt };
};

export const getAgeString = (
    a: { age?: string; month?: string; dob?: string },
    prefix?: string,
    suffix?: string,
    visitDate?: string,
): string => {
    const { aa, am, ad, ageInt, ageMonthInt, ageDayInt } = parseAge(a, visitDate);

    if (isNaN(ageInt) && isNaN(ageMonthInt)) {
        return '';
    }

    if (aa && am && ageInt > 0 && ageMonthInt > 0) {
        if (ageInt < 10 && ad && ageDayInt > 0) {
            return `${prefix || ''}${ageInt}y, ${ageMonthInt}m, ${ageDayInt}d${suffix || ''}`;
        }
        return `${prefix || ''}${ageInt}y, ${ageMonthInt}m${suffix || ''}`;
    }
    if (aa && ageInt > 0) {
        if (ageInt < 10 && (am || ad) && (ageMonthInt > 0 || ageDayInt > 0)) {
            const parts: string[] = [`${ageInt}y`];
            if (ageMonthInt > 0) parts.push(`${ageMonthInt}m`);
            if (ad && ageDayInt > 0) parts.push(`${ageDayInt}d`);
            return `${prefix || ''}${parts.join(', ')}${suffix || ''}`;
        }
        return `${prefix || ''}${ageInt}y${suffix || ''}`;
    }
    if (am && ageMonthInt > 0) {
        if (ageMonthInt > 11) {
            return getAgeString(
                { age: `${ageMonthInt / 12}`, month: `${ageMonthInt % 12}` },
                prefix,
                suffix,
            );
        }
        return `${prefix || ''}${ageMonthInt}m${ad && ageDayInt > 0 ? `, ${ageDayInt}d` : ''}${
            suffix || ''
        }`;
    }
    if (ad && ageDayInt > 0) {
        return `${prefix || ''}${ageDayInt}d${suffix || ''}`;
    }

    return '';
};
