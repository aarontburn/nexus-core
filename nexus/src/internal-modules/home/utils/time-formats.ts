

export const LOCALE: string = "en-US";


export const STANDARD_TIME_FORMAT: Intl.DateTimeFormatOptions =
    { hour: "numeric", minute: "numeric", second: "numeric", hour12: true, };

export const MILITARY_TIME_FORMAT: Intl.DateTimeFormatOptions =
    { hour: "numeric", minute: "numeric", second: "numeric", hour12: false, };

export const FULL_DATE_FORMAT: Intl.DateTimeFormatOptions =
    { weekday: "long", month: "long", day: "numeric", year: "numeric", };

export const ABBREVIATED_DATE_FORMAT: Intl.DateTimeFormatOptions =
    { month: "numeric", day: "numeric", year: "numeric", };
