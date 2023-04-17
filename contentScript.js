chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {
	if (options) {
		replaceText(document.body, options);
	}
});

function roundToNearest(value, nearest) {
	return Math.round(value / nearest) * nearest;
}

function fahrenheitToCelsius(tempInFahrenheit) {
	tempInFahrenheit = parseFloat(tempInFahrenheit)
	return (tempInFahrenheit - 32) * 5 / 9;
}

function milesToKilometers(miles) {
	miles = parseFloat(miles)
	return miles * 1.60934;
}

function feetToMeters(feet) {
	feet = parseFloat(feet)
	return feet * 0.3048;
}

function inchesToCentimeters(inches) {
	inches = parseFloat(inches)
	return inches * 2.54;
}

function poundsToKilograms(pounds) {
	pounds = parseFloat(pounds)
	return pounds * 0.453592;
}

function cupsToDeciliters(cups) {
	cups = parseFloat(cups)
	return cups * 2.5; // 2.36588 
}

function gallonsToLiters(gallons) {
	gallons = parseFloat(gallons)
	return gallons * 3.78541;
}

function mphToKmph(mph) {
	mph = parseFloat(mph);
	return mph * 1.60934;
}

function feetAndInchesToMeters(input) {
	const feetRegex = /(\d+(?:\.\d{1,2})?)\s?(?:ft|foot|feet|'|’|)/i;
	const inchesRegex = /(\d+(?:\.\d{1,2})?)\s?(?:inch(es)?|in|"|“|”|)/i;

	var stringArray = input.split(/(\s+)|ft|foot|feet|'|’/).filter(value => value && value.trim().length > 0);

	if (stringArray.length < 2) {
		return null;
	}

	const feetMatch = stringArray[0].match(feetRegex);
	const inchesMatch = stringArray[1].match(inchesRegex);

	let feet = 0;
	let inches = 0;

	if (feetMatch && feetMatch[1]) {
		feet = parseFloat(feetMatch[1]);
	}

	if (inchesMatch && inchesMatch[1]) {
		inches = parseFloat(inchesMatch[1]);
	}

	return feetToMeters(feet) + inchesToCentimeters(inches) / 100;
}

const findWord = ' enplansvilla';
const replaceWith = ' sexkällare';

function replaceText(node, options) {
	if (node.nodeType === Node.TEXT_NODE) {
		if (node.textContent.trim() !== '') {
			const conversions = [
			{
				name: 'fahrenheitToCelsius',
				regex: /(-?\d+(?:\.\d{1,2})?)\s?°?\s?F\b(?=[\s.,°]|$)/gi,
				converter: fahrenheitToCelsius,
				unit: ' °C',
				decimalPoints: 0,
			},
			{
				name: 'feetAndInchesToMeters',
				regex: /((\d+(?:\.\d{1,2})?)\s?(?:ft|foot|feet|'|’)\s?(\d+(?:\.\d{1,2})?)?(?:inch(es)?|in|"|“|”)?)/gi,
				converter: feetAndInchesToMeters,
				unit: ' m',
				decimalPoints: 2,
			},
			{
				name: 'feetToMeters',
				regex: /(\d+(?:\.\d{1,2})?)\s?(?:ft|foot|feet)/i,
				converter: feetToMeters,
				unit: ' m',
				decimalPoints: 2,
				condition: (text) => !/((\d+(?:\.\d{1,2})?)\s?(?:ft|foot|feet|'|’)\s?(\d+(?:\.\d{1,2})?)?(?:inch(es)?|in|"|“|”)?)/gi.test(text),
			},
			{
				name: 'inchesToCentimeters',
				regex: /(^[0-9]\d+(?:\.\d{1,2})?)\s?(?:inch(es)?|in|"|“|”)(?=[\s.,]|$)/i,
				converter: inchesToCentimeters,
				unit: ' cm',
				decimalPoints: 2,
				condition: (text) => !/((\d+(?:\.\d{1,2})?)\s?(?:ft|foot|feet|'|’)\s?(\d+(?:\.\d{1,2})?)?(?:inch(es)?|in|"|“|”)?)/gi.test(text),
			},
			{
				name: 'milesToKilometers',
				regex: /(-?\d+(?:\.\d{1,2})?)\s?(mi|mile)s?\b/gi,
				converter: milesToKilometers,
				unit: ' km',
				decimalPoints: 2,
			},
			{
				name: 'mphToKmph',
				regex: /(-?\d+(?:\.\d{1,2})?)\s?(mph|mi\/h)\b/gi,
				converter: mphToKmph,
				unit: ' km/h',
				decimalPoints: 2,
			},
			{
				name: 'poundsToKilograms',
				regex: /(-?\d+(?:\.\d{1,4})?)\s?(lb|lbs|pound(s)?)\b/gi,
				converter: poundsToKilograms,
				unit: ' kg',
				decimalPoints: 1,
			},
			{
				name: 'cupsToDeciliters',
				regex: /(\d+(?:\.\d{1,2})?|\d+\s\d\/\d|\d\/\d)\s?cup(s)?\b/gi,
				converter: cupsToDeciliters,
				unit: ' dl',
				decimalPoints: 2,
			},
			{
				name: 'gallonsToLiters',
				regex: /(-?\d+(?:\.\d{1,2})?)\s?(gal|gallon(s)?)\b/gi,
				converter: gallonsToLiters,
				unit: ' L',
				decimalPoints: 2,
			},
		];
		  
			let newText = node.textContent;
			newText = node.textContent.split(findWord).join(replaceWith);
			for (const conversion of conversions) {
				if (!options[conversion.name + "Enabled"]) {
					continue;
				}
				if (conversion.condition && !conversion.condition(newText)) {
					continue;
				}
				newText = newText.replace(conversion.regex, (match, value, unit) => {
					const fractionRegex = /(\d+)\s(\d)\/(\d)/;
					if (fractionRegex.test(value)) {
						const [, whole, numerator, denominator] = value.match(fractionRegex);
						value = parseFloat(whole) + (parseFloat(numerator) / parseFloat(denominator));
					} else if (value.includes('/')) {
						const [numerator, denominator] = value.split('/');
						value = parseFloat(numerator) / parseFloat(denominator);
					}
					
					const metricValue = conversion.converter(value);
					//return metricValue === null ? match : `${match} (${metricValue.toFixed(conversion.decimalPoints)}${conversion.unit})`;
					return metricValue === null ? match : `${match} (${roundToNearest(metricValue, options[conversion.name + "Round"])}${conversion.unit})`;
				});
			}
			node.textContent = newText;
		}
	} else {
		for (let i = 0; i < node.childNodes.length; i++) {
			replaceText(node.childNodes[i], options);
		}
	}
}