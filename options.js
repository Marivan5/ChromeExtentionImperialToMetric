function saveOptions() {
  const options = {};
  const checkboxes = document.querySelectorAll('#optionsForm input[type="checkbox"]');
  const roundToNumbers = document.querySelectorAll('#optionsForm input[type="number"]');
  checkboxes.forEach((checkbox) => {
    options[checkbox.name] = checkbox.checked;
  });

  roundToNumbers.forEach((number) => {
    options[number.name] = number.value;
  })

  // chrome.storage.local.set(options, () => {
  //   alert('Options saved.');
  // });
}

function loadOptions() {
  chrome.storage.local.get(null, (options) => {
    if (!options || Object.keys(options).length === 0) {
      // If no options are found in the storage, set default values
      options = {
        fahrenheitToCelsiusEnabled: true,
        feetAndInchesToMetersEnabled: true,
        milesToKilometersEnabled: true,
        mphToKmphEnabled: true,
        feetToMetersEnabled: true,
        inchesToCentimetersEnabled: true,
        poundsToKilogramsEnabled: true,
        cupsToDecilitersEnabled: true,
        gallonsToLitersEnabled: true,
        fahrenheitToCelsiusRound: 5,
        feetAndInchesToMetersRound: 0.01,
        feetToMetersRound: 0.01,
        inchesToCentimetersRound: 0.01,
        milesToKilometersRound: 0.01,
        mphToKmphRound: 1,
        poundsToKilogramsRound: 0.01,
        cupsToDecilitersRound: 0.05,
        gallonsToLitersRound: 0.01,
      };

      // Save the default options to the storage
      chrome.storage.local.set(options);
    }

    // Load options on the options page
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const element = document.querySelector(`input[name="${key}"]`);
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = options[key];
          } else if (element.type === 'number') {
            element.value = options[key];
          }
        }
      }
    }
  });
}

function addChangeListeners() {
  const checkboxes = document.querySelectorAll('#optionsForm input[type="checkbox"]');
  const roundToNumbers = document.querySelectorAll('#optionsForm input[type="number"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', saveOptions);
  });

  roundToNumbers.forEach((number) => {
    number.addEventListener('change', saveOptions);
  });

  feetAndInchesToMetersCheckbox.addEventListener('change', () => {
    feetToMetersLabel.style.opacity = feetAndInchesToMetersCheckbox.checked ?  '1' : '0.5';
    inchesToCentimetersLabel.style.opacity = feetAndInchesToMetersCheckbox.checked ? '1' : '0.5';
  });
}

addChangeListeners();
loadOptions();