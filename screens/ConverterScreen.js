import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import CurrencyInput from '../components/CurrencyInput';
import { getAvailableCurrencies, convertCurrency } from '../api/currencyApi';
import { saveConversion } from '../database/database';

const ConverterScreen = () => {
  // Variables de estado
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Cargar monedas disponibles al iniciar
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        const availableCurrencies = await getAvailableCurrencies();
        
        if (availableCurrencies && availableCurrencies.length > 0) {
          console.log('Total de monedas cargadas:', availableCurrencies.length);
          setCurrencies(availableCurrencies);
          
          // Configurar monedas iniciales
          if (availableCurrencies.includes('USD')) {
            setFromCurrency('USD');
          } else if (availableCurrencies.length > 0) {
            setFromCurrency(availableCurrencies[0]);
          }
          
          if (availableCurrencies.includes('EUR')) {
            setToCurrency('EUR');
          } else if (availableCurrencies.length > 1) {
            setToCurrency(availableCurrencies[1]);
          } else if (availableCurrencies.length > 0) {
            setToCurrency(availableCurrencies[0]);
          }
        } else {
          Alert.alert('Error', 'No hay monedas disponibles. Verifique su conexión a internet.');
        }
      } catch (err) {
        Alert.alert('Error', 'Error al cargar las monedas. Intente nuevamente más tarde.');
        console.error('Error al cargar monedas:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  // Manejar cambio de moneda de origen
  const handleFromCurrencyChange = (currency) => {
    console.log('Moneda de origen cambiada a:', currency);
    setFromCurrency(currency);
    setResult('');
  };

  // Manejar cambio de moneda de destino
  const handleToCurrencyChange = (currency) => {
    console.log('Moneda de destino cambiada a:', currency);
    setToCurrency(currency);
    setResult('');
  };

  // Función para intercambiar monedas
  const handleSwapCurrencies = () => {
    console.log('Intercambiando monedas');
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    if (result) {
      setAmount(result);
      setResult(amount);
    }
  };

  // Validación de entrada
  const validateInput = () => {
    if (!amount || amount.trim() === '') {
      setError('Por favor ingrese un monto');
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setError('Por favor ingrese un número válido');
      return false;
    }

    if (numAmount <= 0) {
      setError('El monto debe ser mayor que cero');
      return false;
    }

    setError('');
    return true;
  };

  // Función para realizar la conversión
  const handleConvert = async () => {
    if (!validateInput()) return;

    try {
      setLoading(true);
      const numAmount = parseFloat(amount);
      
      console.log(`Convirtiendo ${numAmount} de ${fromCurrency} a ${toCurrency}`);
      
      const conversionResult = await convertCurrency(
        fromCurrency,
        toCurrency,
        numAmount
      );
      
      setResult(conversionResult.result.toFixed(2));
      
      // Guardar en el historial
      await saveConversion(
        fromCurrency,
        toCurrency,
        numAmount,
        conversionResult.result,
        conversionResult.rate
      );
    } catch (err) {
      Alert.alert('Error de conversión', err.message || 'Error al convertir la moneda');
      console.error('Error durante la conversión:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar pantalla de carga mientras se inicializa
  if (isInitializing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Cargando monedas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Currency Converter</Text>
          
          <View style={styles.card}>
            <CurrencyInput
              label="From"
              value={amount}
              onValueChange={setAmount}
              selectedCurrency={fromCurrency}
              onCurrencyChange={handleFromCurrencyChange}
              currencies={currencies}
              error={error}
            />
            
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapCurrencies}
            >
              <AntDesign name="swap" size={24} color="#2c3e50" />
            </TouchableOpacity>
            
            <CurrencyInput
              label="To"
              value={result}
              selectedCurrency={toCurrency}
              onCurrencyChange={handleToCurrencyChange}
              currencies={currencies}
              isReadOnly={true}
            />
            
            <TouchableOpacity
              style={[
                styles.convertButton,
                loading && styles.convertButtonDisabled
              ]}
              onPress={handleConvert}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.convertButtonText}>Convert</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 24,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  convertButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24
  },
  convertButtonDisabled: {
    backgroundColor: '#95a5a6'
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default ConverterScreen;