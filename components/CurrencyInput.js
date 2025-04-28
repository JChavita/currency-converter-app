import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CurrencyInput = ({
  label,
  value,
  onValueChange,
  selectedCurrency,
  onCurrencyChange,
  currencies = [],
  isReadOnly = false,
  error = ''
}) => {
  // modal personalized
  const [modalVisible, setModalVisible] = useState(false);
  const safeCurrency = selectedCurrency || 'USD';
  
  //ios render
  const renderIOSPicker = () => {
    return (
      <View>
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => !isReadOnly && setModalVisible(true)}
          disabled={isReadOnly}
        >
          <Text style={styles.pickerButtonText}>{safeCurrency}</Text>
        </TouchableOpacity>
        
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              
              <FlatList
                data={currencies}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.currencyItem,
                      safeCurrency === item && styles.selectedCurrency
                    ]}
                    onPress={() => {
                      onCurrencyChange(item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.currencyText}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.currencyList}
              />
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.rowContainer}>
        <TextInput
          style={[
            styles.input,
            isReadOnly && styles.readOnlyInput,
            error && styles.inputError
          ]}
          value={value}
          onChangeText={onValueChange}
          keyboardType="numeric"
          editable={!isReadOnly}
          placeholder="0.00"
        />
        
        {/* Contenedor del selector de moneda */}
        <View style={styles.pickerContainer}>
          {Platform.OS === 'ios' ? (
            //IOS picker
            renderIOSPicker()
          ) : (
            <Picker
              selectedValue={safeCurrency}
              onValueChange={onCurrencyChange}
              enabled={!isReadOnly}
              style={styles.pickerAndroid}
              mode="dropdown"
            >
              {currencies.map((currency) => (
                <Picker.Item key={currency} label={currency} value={currency} />
              ))}
            </Picker>
          )}
        </View>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%'
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5'
  },
  inputError: {
    borderColor: 'red'
  },
  pickerContainer: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  pickerAndroid: {
    width: '100%',
    height: 50,
    color: '#333'
  },
  // Estilos para el selector personalizado de iOS
  pickerButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333'
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  currencyList: {
    maxHeight: '80%'
  },
  currencyItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  selectedCurrency: {
    backgroundColor: '#f0f0f0'
  },
  currencyText: {
    fontSize: 16
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4
  }
});

export default CurrencyInput;