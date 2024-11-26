
//https://v6.exchangerate-api.com/v6/6afaeacf29c11f247e2f9288/latest/USD
//https://api.currencylayer.com/list?access_key=16f71d4616fb0e73d7625fd1ea958013

const apiKey = '6afaeacf29c11f247e2f9288';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

const currencyLayerApiKey = '16f71d4616fb0e73d7625fd1ea958013';
const currencyListApiUrl = `http://api.currencylayer.com/list?access_key=${currencyLayerApiKey}`;

let currencyData = {};

// Populate currency options
async function loadCurrencies() {
  try {
    const resp = await fetch(currencyListApiUrl);
    const curname = await resp.json();
    currencyData = curname.currencies;

    const response = await fetch(apiUrl);
    const data = await response.json();
    // console.log(data);
    const currencyKeys = Object.keys(data.conversion_rates);
    // console.log(currencyKeys);
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    currencyKeys.forEach(currency => {
      const optionFrom = document.createElement('option');
      const optionTo = document.createElement('option');

      const currencyName = currencyData[currency];

      optionFrom.value = currency;
      optionTo.value = currency;
      optionFrom.textContent = `${currency} - ${currencyName}`;
      optionTo.textContent = `${currency} - ${currencyName}`;
      fromCurrency.appendChild(optionFrom);
      toCurrency.appendChild(optionTo);

    });
    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
  } catch (error) {
    console.error("Failed to load currencies:", error);
  }
}

// Convert currency
async function exchangeCurrency() {
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const amount = document.getElementById('amount').value;
  if (!amount || isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`);
    const data = await response.json();
    if (data.result === "success") {
      const rate = data.conversion_rate;
      const convertedAmount = (amount * rate).toFixed(2);
      document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } else {
      document.getElementById('result').textContent = "Conversion failed. Please try again.";
    }
  } catch (error) {
    document.getElementById('result').textContent = "Error: Could not retrieve exchange rate.";
    // console.error("Conversion error:", error);
  }
}
// Load currencies on page load
loadCurrencies();


function interchangeCurrencies() {
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  document.getElementById('fromCurrency').value = toCurrency;
  document.getElementById('toCurrency').value = fromCurrency;
}
//Interchanging Currencies
document.querySelector('#exchange span').addEventListener("click", interchangeCurrencies);

//Live Result
let allsel = document.querySelectorAll('select');
// console.log(allsel)
allsel.forEach(item => {
  item.addEventListener("change", () => {
    // console.log(item);
    exchangeCurrency();
  });
});


//For currency name
async function getCurrencyName() {
  try {
    const response = await fetch(currencyListApiUrl);
    const data = await response.json();
    currencyData = data.currencies;
    if (data.success) {
      populateCurrencyDropdowns();
    } else {
      console.error("Failed to load currency list:", data.error);
    }
  } catch (error) {
    console.error("Error loading currency list:", error);
  }
}

// Populate dropdowns with currency info
function populateCurrencyDropdowns() {
  const fromCurrency = document.getElementById('fromCurrency');
  const toCurrency = document.getElementById('toCurrency');
  for (const code in currencyData) {
    const optionFrom = document.createElement('option');
    const optionTo = document.createElement('option');

    const currencyName = currencyData[code];
    optionFrom.textContent = `${currencyName} - ${code}`;
    optionTo.textContent = `${currencyName} - ${code}`;
    optionFrom.value = code;
    optionTo.value = code;
    fromCurrency.appendChild(optionFrom);
    toCurrency.appendChild(optionTo);

    console.log(currencyData[code])
  }
  fromCurrency.value = 'USD';
  toCurrency.value = 'EUR';
}
