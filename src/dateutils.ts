export function formatDateInTimeZone({
    date = new Date().toISOString(),
    timeZone = 'Asia/Kolkata',
}: {
    date?: string;
    timeZone?: string;
}): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone,
    }).format(new Date(date));
}
