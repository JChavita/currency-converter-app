import * as SQLite from 'expo-sqlite';

let db = null;

// Function to initialize the database
export const initDatabase = async () => {
  try {
    if (!db) {
      db = await SQLite.openDatabaseAsync('currency_converter.db');
      console.log('Database initialized successfully');
    }
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Create tables
export const setupDatabase = async () => {
  try {
    const database = await initDatabase();
    
    // Create currency_rates table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS currency_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        base_currency TEXT NOT NULL,
        rates TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );`
    );
    
    // Create conversion_history table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS conversion_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_currency TEXT NOT NULL,
        to_currency TEXT NOT NULL,
        amount REAL NOT NULL,
        result REAL NOT NULL,
        rate REAL NOT NULL,
        timestamp INTEGER NOT NULL
      );`
    );
    
    console.log('Tables setup successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

// Save currency rates to database
export const saveCurrencyRates = async (baseCurrency, rates) => {
  try {
    const database = await initDatabase();
    const timestamp = Date.now();
    const ratesJson = JSON.stringify(rates);
    
    await database.runAsync(
      `INSERT INTO currency_rates (base_currency, rates, timestamp)
       VALUES (?, ?, ?);`,
      [baseCurrency, ratesJson, timestamp]
    );
    
    console.log('Currency rates saved successfully');
  } catch (error) {
    console.error('Error saving currency rates:', error);
    throw error;
  }
};

// Get the latest currency rates from the database
export const getLatestCurrencyRates = async (baseCurrency) => {
  try {
    const database = await initDatabase();
    // Calculate timestamp for 2 days ago
    const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
    
    const result = await database.getAllAsync(
      `SELECT * FROM currency_rates 
       WHERE base_currency = ? AND timestamp > ? 
       ORDER BY timestamp DESC LIMIT 1;`,
      [baseCurrency, twoDaysAgo]
    );
    
    if (result.length > 0) {
      const item = result[0];
      return {
        baseCurrency: item.base_currency,
        rates: JSON.parse(item.rates),
        timestamp: item.timestamp
      };
    } else {
      return null; // No recent data found
    }
  } catch (error) {
    console.error('Error fetching latest currency rates:', error);
    throw error;
  }
};

// Save conversion to history
export const saveConversion = async (fromCurrency, toCurrency, amount, result, rate) => {
  try {
    const database = await initDatabase();
    const timestamp = Date.now();
    
    await database.runAsync(
      `INSERT INTO conversion_history 
       (from_currency, to_currency, amount, result, rate, timestamp)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [fromCurrency, toCurrency, amount, result, rate, timestamp]
    );
    
    console.log('Conversion saved to history');
  } catch (error) {
    console.error('Error saving conversion to history:', error);
    throw error;
  }
};

// Get conversion history
export const getConversionHistory = async () => {
  try {
    const database = await initDatabase();
    const result = await database.getAllAsync('SELECT * FROM conversion_history ORDER BY timestamp DESC;');
    
    return result;
  } catch (error) {
    console.error('Error fetching conversion history:', error);
    throw error;
  }
};

// Clean up old records
export const cleanupOldRecords = async () => {
  try {
    const database = await initDatabase();
    // Calculate timestamp for 2 days ago
    const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
    
    await database.runAsync(
      'DELETE FROM currency_rates WHERE timestamp < ?;',
      [twoDaysAgo]
    );
    
    console.log('Old records cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up old records:', error);
    throw error;
  }
};

export default {
  initDatabase,
  setupDatabase,
  saveCurrencyRates,
  getLatestCurrencyRates,
  saveConversion,
  getConversionHistory,
  cleanupOldRecords
};