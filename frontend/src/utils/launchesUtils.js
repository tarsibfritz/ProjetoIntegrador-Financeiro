export const groupLaunchesByMonth = (launches) => {
    const grouped = {};

    launches.forEach(launch => {
        const date = new Date(launch.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'

        if (!grouped[yearMonth]) {
            grouped[yearMonth] = [];
        }
        grouped[yearMonth].push(launch);
    });

    return grouped;
};