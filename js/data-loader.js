"use strict";

async function requestFile(filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(`Could not load ${filePath} (${response.status})`);
    }

    return response;
}

async function loadJSON(filePath) {
    const response = await requestFile(filePath);
    const records = await response.json();

    if (!Array.isArray(records)) {
        throw new Error(`${filePath} must contain an array of records`);
    }

    return records;
}

async function loadCSV(filePath) {
    if (typeof Papa === "undefined") {
        throw new Error("The CSV reader did not load");
    }

    const response = await requestFile(filePath);
    const csvText = await response.text();
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    if (result.errors.length > 0) {
        throw new Error(`Could not parse ${filePath}`);
    }

    return result.data;
}

async function loadAllData() {
    const spotifyHistory = await loadCSV("data/spotify_history.csv");

    const householdTransactions = await loadCSV("data/Daily Household Transactions.csv");
    const transactions = await loadJSON("data/Augmented_IndiaTransactMultiFacet2024.json");

    return {
        spotifyHistory,
        householdTransactions,
        transactions
    };
}
