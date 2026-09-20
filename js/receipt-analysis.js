function analyzeLifeReceipts(data) {
    const spotifyCount = data.spotifyHistory.length;
    const householdCount = data.householdTransactions.length;

    const transactionCount = Array.isArray(data.transactions)
        ? data.transactions.length
        : 0;

    return {
        totalReceipts: spotifyCount + householdCount + transactionCount,
        spotifyCount,
        householdCount,
        transactionCount
    };
}