const units = [
    ["year", 365 * 24 * 60 * 60],
    ["week", 7 * 24 * 60 * 60],
    ["day", 24 * 60 * 60],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1]
];

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

export function timeAgo(dateValue, now = Date.now()) {
    const date = new Date(dateValue).getTime();
    if (!Number.isFinite(date)) return "";
    const seconds = Math.round((date - now) / 1000);
    for (const [unit, unitSeconds] of units) {
        if (Math.abs(seconds) >= unitSeconds || unit === "second") {
            return relativeTime.format(Math.round(seconds / unitSeconds), unit);
        }
    }
    return "";
}
