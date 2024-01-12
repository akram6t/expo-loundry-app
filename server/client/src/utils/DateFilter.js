export const today = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return { $gte: todayStart };
}

export const yesterday = () => {
    // Get the start of yesterday (00:00:00)
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    // Get the end of yesterday (23:59:59)
    const yesterdayEnd = new Date(yesterdayStart.getTime());
    yesterdayEnd.setHours(23, 59, 59, 999);

    return { $gte: yesterdayStart, $lt: yesterdayEnd }
}

export const sevenDaysAgo = () => {
    // Get the current date and time
    const now = new Date();
    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return { $gte: sevenDaysAgo, $lt: now };
}
export const thirtyDaysAgo = () => {
    // Get the current date and time
    const now = new Date();
    // Calculate the date 7 days ago
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return { $gte: thirtyDaysAgo, $lt: now };
}
export const oneYearAgo = () => {
    // Get the current date and time
    const now = new Date();
    // Calculate the date 7 days ago
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    return { $gte: thirtyDaysAgo, $lt: now };
}