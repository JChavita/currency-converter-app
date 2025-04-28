import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRelativeTime } from '../utils/dateUtils';

/**
 * Component to display a single conversion history item
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - Conversion history item
 */
const ConversionItem = ({ item }) => {
  const {
    from_currency,
    to_currency,
    amount,
    result,
    rate,
    timestamp
  } = item;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.currencies}>
          {from_currency} → {to_currency}
        </Text>
        <Text style={styles.timestamp}>
          {getRelativeTime(timestamp)}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.amount}>
          {amount.toFixed(2)} {from_currency}
        </Text>
        <Text style={styles.equals}>=</Text>
        <Text style={styles.result}>
          {result.toFixed(2)} {to_currency}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.rate}>
          Rate: 1 {from_currency} = {rate.toFixed(4)} {to_currency}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  currencies: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  timestamp: {
    fontSize: 12,
    color: '#666'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  amount: {
    fontSize: 16,
    color: '#555'
  },
  equals: {
    fontSize: 16,
    marginHorizontal: 8,
    color: '#888'
  },
  result: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c3e50'
  },
  footer: {
    marginTop: 4
  },
  rate: {
    fontSize: 12,
    color: '#777'
  }
});

export default ConversionItem;