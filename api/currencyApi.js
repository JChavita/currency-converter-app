import { getLatestCurrencyRates, saveCurrencyRates } from '../database/database';

// Replace with your actual API key
const API_KEY = 'dbcff76003c2b18e41ae3ede';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export const getExchangeRates = async (baseCurrency) => {
  try {
    // First try to get rates from the local database
    const cachedRates = await getLatestCurrencyRates(baseCurrency);
    
    if (cachedRates) {
      console.log('Using cached exchange rates');
      return cachedRates;
    }
    
    console.log('Fetching fresh exchange rates from API');
    // If no valid cached data, fetch from API
    const response = await fetch(`${BASE_URL}/latest/${baseCurrency}`);
    const data = await response.json();
    
    if (data.result === 'success') {
      // Save the new rates to the database
      await saveCurrencyRates(baseCurrency, data.conversion_rates);
      
      return {
        baseCurrency: baseCurrency,
        rates: data.conversion_rates,
        timestamp: Date.now()
      };
    } else {
      throw new Error(data.error || 'Failed to fetch exchange rates');
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

export const getAvailableCurrencies = async () => {
  try {
    // First try to get USD rates which contain all available currencies
    const exchangeData = await getExchangeRates('USD');
    
    if (exchangeData && exchangeData.rates) {
      // Return the keys of the rates object as available currencies
      return Object.keys(exchangeData.rates);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting available currencies:', error);
    throw error;
  }
};

export const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  try {
    const exchangeData = await getExchangeRates(fromCurrency);
    
    if (exchangeData && exchangeData.rates) {
      const rate = exchangeData.rates[toCurrency];
      
      if (!rate) {
        throw new Error(`Exchange rate not available for ${toCurrency}`);
      }
      
      const result = amount * rate;
      
      return {
        fromCurrency,
        toCurrency,
        amount,
        result,
        rate
      };
    }
    
    throw new Error('Failed to get exchange rates');
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

export default {
  getExchangeRates,
  getAvailableCurrencies,
  convertCurrency
};