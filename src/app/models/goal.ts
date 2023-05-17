export interface IMinute {
    total: number;
    percentage: string;
}

export interface IGoal {
    "0-15": IMinute;
    "16-30": IMinute;
    "31-45": IMinute;
    "46-60": IMinute;
    "61-75": IMinute;
    "76-90": IMinute;
    "91-105": IMinute;
    "106-120": IMinute;
}
