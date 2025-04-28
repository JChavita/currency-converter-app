# Currency Converter App

A mobile application built with React Native and Expo that allows users to convert between different currencies using real-time exchange rates.

## Features

- Convert between 160+ currencies
- View conversion history
- Local caching of exchange rates
- Clean and intuitive UI
- Offline support with SQLite database

## Screenshots
![WhatsApp Image 2025-04-28 at 14 53 12_75c0ea98](https://github.com/user-attachments/assets/92bca04e-5cfb-4c0e-984e-f561fc141ce8)
![photo2](https://github.com/user-attachments/assets/db7c9058-a576-4e7d-b3e4-5e6ebca7c026)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/currency-converter-app.git
cd currency-converter-app
```

2. Install dependencies:
```bash
npm install
# or using Yarn
yarn install
```

3. Install specific dependencies:
```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# SQLite
npx expo install expo-sqlite

# UI Components
npm install @react-native-picker/picker
```

## Configuration

1. Get an API key from [exchangerate-api.com](https://www.exchangerate-api.com/)

2. Update the API key in `api/currencyApi.js`:
```javascript
const API_KEY = 'your_api_key_here';
```

## Running the App

1. Start the development server:
```bash
npx expo start
```

2. Run on your device or emulator:
- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Scan the QR code with the Expo Go app on your phone

## Project Structure

```
currency-converter-app/
├── App.js              # Main entry point with navigation setup
├── api/
│   └── currencyApi.js  # API functions for fetching exchange rates
├── components/
│   ├── CurrencyInput.js    # Reusable currency input component
│   └── ConversionItem.js   # Component for displaying conversion history
├── database/
│   └── database.js     # SQLite setup and operations
├── screens/
│   ├── ConverterScreen.js  # Main conversion screen
│   └── HistoryScreen.js    # History of conversions
└── utils/
    └── dateUtils.js    # Helper functions for date operations
```

## Dependencies

- **React Native**: Framework for building native apps using React
- **Expo**: Platform for making universal native apps
- **React Navigation**: Navigation library for React Native apps
- **expo-sqlite**: SQLite database library for Expo
- **@react-native-picker/picker**: Picker component for React Native

## Troubleshooting

If you encounter issues with dependency installation:
1. Delete `node_modules` folder and `package-lock.json` file
2. Run `npm install` again
3. Clear Metro bundler cache: `npx expo start -c`

## Acknowledgements

- Exchange rates provided by [exchangerate-api.com](https://www.exchangerate-api.com/)
- Icons by [Expo Vector Icons](https://icons.expo.fyi/)
