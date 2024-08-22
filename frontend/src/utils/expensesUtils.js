export const groupExpensesByMonth = (expenses) => {
    const grouped = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'

        if (!grouped[yearMonth]) {
            grouped[yearMonth] = [];
        }
        grouped[yearMonth].push(expense);
    });

    return grouped;
};