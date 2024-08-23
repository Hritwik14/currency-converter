

const BASE_URL = "https://v6.exchangerate-api.com/v6/019fe61427f070cf0310089c/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Function to update the flag based on the selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    select.appendChild(newOption);
  }
}

// Set the default values for from and to currencies
fromCurr.value = "USD";
toCurr.value = "INR";

// Update flags for default currencies
updateFlag(fromCurr);
updateFlag(toCurr);

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("API request failed.");
    let data = await response.json();
    let rate = data.conversion_rates[toCurr.value];

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate. Please try again later.";
  }
};

// Event listeners for dropdown changes
fromCurr.addEventListener("change", () => updateFlag(fromCurr));
toCurr.addEventListener("change", () => updateFlag(toCurr));

// Initial exchange rate update
window.addEventListener("load", () => {
  updateExchangeRate();
});

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
