function saveOptions() {
  const options = {};
  const checkboxes = document.querySelectorAll('#optionsForm input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    options[checkbox.name] = checkbox.checked;
  });

  chrome.storage.local.set(options, () => {
    alert('Options saved.');
  });
}

function loadOptions() {
  chrome.storage.local.get(null, (options) => {
    if (!options || Object.keys(options).length === 0) {
      // If no options are found in the storage, set default values
      options = {
        fahrenheitToCelsius: true,
        feetAndInchesToMeters: true,
        milesToKilometers: true,
        mphToKmph: true,
        feetToMeters: true,
        inchesToCentimeters: true,
        poundsToKilograms: true,
        cupsToDeciliters: true,
        gallonsToLiters: true,
      };

      // Save the default options to the storage
      chrome.storage.local.set(options);
    }

    // Load options on the options page
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const element = document.querySelector(`input[name="${key}"]`);
        if (element) {
          element.checked = options[key];
        }
      }
    }
  });
}

document.getElementById('saveOptions').addEventListener('click', saveOptions);
loadOptions();