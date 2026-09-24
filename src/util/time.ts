export function getDateTimeBySec(sec: number) {
    const time = new Date(sec * 1000);

    const y = time.getFullYear();
    const m = (time.getMonth() + 1).toString().padStart(2, "0");
    const d = time.getDate().toString().padStart(2, "0");

    const h = time.getHours().toString().padStart(2, "0");
    const mi = time.getMinutes().toString().padStart(2, "0");
    const s = time.getSeconds().toString().padStart(2, "0");

    return `${h}:${mi}:${s} ${y}-${m}-${d}`;
}

export function getMinBySec(sec: number) {
    return (sec / 60).toFixed(0);
}

export function getTimeAndPeriodBySec(sec: number) {
    const time = new Date(sec);
    const m = time.getMinutes();
    const s = time.getSeconds();

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} ${m < 12 ? "AM" : "PM"}`;
}