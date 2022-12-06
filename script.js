const userOutput = document.querySelector("input.output");
const userInput = document.querySelector("input.input");
const currentCurrencies = document.querySelectorAll(
  ".currency.current-currency"
);
const targetCurrencies = document.querySelectorAll(".currency.target-currency");
const conversionDetails = document.querySelectorAll(".conversion-info");

let currentCurrency = "RUB";
let targetCurrency = "USD";

const currencySelectHandler = function () {
  return currentCurrency === targetCurrency
    ? (userOutput.value = "Invalid Currency") &&
        userInput.setAttribute("disabled", true)
    : getConversionDetails(userInput.value, currentCurrency, targetCurrency) &&
        userInput.removeAttribute("disabled");
};

currentCurrencies.forEach((currency) => {
  currency.addEventListener("click", function () {
    // CHANGING CURRENCY UI
    for (let curr of currentCurrencies) {
      curr.classList.remove("active");
    }
    this.classList.add("active");

    currentCurrency = currency.getAttribute("data-id");
    currencySelectHandler();
  });
});

targetCurrencies.forEach((currency) => {
  currency.addEventListener("click", function () {
    // CHANGING CURRENCY UI
    for (let curr of targetCurrencies) {
      curr.classList.remove("active");
    }
    this.classList.add("active");

    targetCurrency = currency.getAttribute("data-id");
    currencySelectHandler();
  });
});

const getConversionDetails = async (value, current, target) => {
  // PULLING CORRESPONDING DATA FROM SERVER BASED ON USER SELECTIONS
  const response = await fetch(
    `https://api.exchangerate.host/latest?base=${current}&symbols=${target}`
  );
  const data = await response.json();
  const rate = data.rates[Object.keys(data.rates)[0]];
  const result = value == 0 ? "" : (rate * value).toFixed(3);

  displayConvertedData(result, rate);
};

const displayConvertedData = (result, rate) => {
  conversionDetails[0].innerText = `1 ${currentCurrency} = ${rate.toFixed(
    3
  )} ${targetCurrency}`;

  conversionDetails[1].innerText = `1 ${targetCurrency} = ${(1 / rate).toFixed(
    3
  )} ${currentCurrency}`;

  userOutput.value = result;
};

// ALLOWS UPDATING INPUT/OUTPUT
let timer;
userInput.addEventListener("input", function () {
  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    getConversionDetails(this.value, currentCurrency, targetCurrency);
  }, 750);
});
