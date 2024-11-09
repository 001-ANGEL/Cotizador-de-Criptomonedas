//* Cotizador de Criptomonedas

const cryptocurrencySelect = document.querySelector("#criptomonedas");
const currencySelect = document.querySelector("#moneda");
const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");

const objSearch = {
  currency: "",
  cryptocurrency: "",
};

//* Creacion del Promise
const getCryptocurrency = (cryptocurrency) =>
  new Promise((resolve) => {
    resolve(cryptocurrency);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultCryptocurrency();

  form.addEventListener("submit", submitForm);

  cryptocurrencySelect.addEventListener("change", readValue);
  currencySelect.addEventListener("change", readValue);
});

function consultCryptocurrency() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((response) => response.json())
    .then((result) => getCryptocurrency(result.Data))
    .then((cryptocurrency) => selectCryptcurrency(cryptocurrency));
}

function selectCryptcurrency(cryptocurrency) {
  cryptocurrency.forEach((crypto) => {
    const { FullName, Name } = crypto.CoinInfo;

    const option = document.createElement("OPTION");
    option.value = Name;
    option.textContent = FullName;

    cryptocurrencySelect.appendChild(option);
  });
}

function readValue(event) {
  objSearch[event.target.name] = event.target.value;
  console.log(objSearch);
}

function submitForm(event) {
  event.preventDefault();

  //Validar
  const { currency, cryptocurrency } = objSearch;

  if (currency === "" || cryptocurrency === "") {
    showAlert("Ambos campos son obligatorios");
    return;
  }

  //* Consultar la API con los resultados
  consultAPI();
}

function showAlert(message) {
  //*alerta
  const existingAlert = document.querySelector(".error");
  if (!existingAlert) {
    const alert = document.createElement("P");
    alert.classList.add("error");
    alert.textContent = message;

    form.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function consultAPI() {
  const { currency, cryptocurrency } = objSearch;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

  showSpinner();

  fetch(url)
    .then((response) => response.json())
    .then((quote) => {
      showQuote(quote.DISPLAY[cryptocurrency][currency]);
    });
}

function showQuote(quote) {
  cleanHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quote;

  //*Precio
  const price = document.createElement("P");
  price.classList.add("precio");
  price.innerHTML = `El precio es de: <span>${PRICE}</span>`;

  //* precio mas alto
  const priceHighDay = document.createElement("P");
  priceHighDay.innerHTML = `Precio más alto del dia: <span>${HIGHDAY}</span>`;

  //* precio mas bajo
  const priceLowDay = document.createElement("P");
  priceLowDay.innerHTML = `Precio más bajo del dia: <span>${LOWDAY}</span>`;

  //* Cambio en las ultimas horas
  const lastChangeHour = document.createElement("P");
  lastChangeHour.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  //* Cambio en las ultimas horas
  const lastUpdate = document.createElement("P");
  lastUpdate.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

  result.appendChild(price);
  result.appendChild(priceHighDay);
  result.appendChild(priceLowDay);
  result.appendChild(lastChangeHour);
  result.appendChild(lastUpdate);
}

function cleanHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

function showSpinner() {
  cleanHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("sk-chase");

  spinner.innerHTML = `
   <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  `;

  result.appendChild(spinner);
}
