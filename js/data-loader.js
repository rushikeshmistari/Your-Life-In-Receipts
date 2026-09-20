async function loadJSON(filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
            throw new Error(`Could not load ${filePath}`);
    }

    return response.json();
}

async function loadCSV(filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
            throw new Error(`Could not load ${filePath}`);
    }

    const csvText = await response.text();

    return Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
    }).data;
}

async function loadAllData() {
    const spotifyHistory = await loadCSV("data/spotify_history.csv");

    const householdTransactions = await loadCSV(
            "data/Daily Household Transactions.csv"
    );

    const transactions = await loadJSON(
    "data/Augmented_IndiaTransactMultiFacet2024.json"
);

    return {
        spotifyHistory,
        householdTransactions,
        transactions
    };
}