import chalk from 'chalk';
import Table from 'cli-table3';

const prompt = require('prompt-sync')({sigint: true});
const messages = {
    initialMessage: `
    ${chalk.blueBright('Hello!')}, I'm ${chalk.blueBright('CoffeeCalculator')}
    I can tell you how long until your coffee's taste changes.
    Before we begin I just have some questions.
    `,
    confirmCountry: `
    What ${chalk.blueBright('country')} do you live in?
    `,
    confirmCity: `
    What ${chalk.blueBright('city')} do you live in?
    `,
    coffeePreference: `
    What kind of ${chalk.greenBright('coffee')} are you drinking?
        Enter 1 for ${chalk.blueBright('flat white')}
        Enter 2 for ${chalk.blueBright('long black')}
        Enter 3 for ${chalk.blueBright('latte')}
        Enter 4 for ${chalk.blueBright('cappuccino')}
        Enter 5 is you'd like me to just run a ${chalk.blueBright('default')} calculation
    `,
    countryError: `
    I'm sorry, I wasn't able to find your ${chalk.blueBright('country')}, please try again. If
    you would like to quit please press ${chalk.blueBright('Ctrl + C')}. For a list of the acceptable
    inputs I use, please refer to ${chalk.magentaBright('https://datahub.io/core/country-list#data')}.
    `,
    cityError: `
    I'm sorry, I wasn't able to find your ${chalk.blueBright('city')}, please try again. If
    you would like to quit please press ${chalk.blueBright('Ctrl + C')}. For a list of the acceptable
    inputs I use, please refer to ${chalk.magentaBright('https://openweathermap.org/')} to find your city.
    `,
    coffeeError: `
    Please enter a number within the range of ${chalk.blueBright('1 - 4')}.
    `
}

export async function startCalculate(args) {
    console.log(messages.initialMessage);
    const countryCode = countryCheck();
    const cityID = cityCheck(countryCode);
    var coffeeTemperature = coffeeCheck();
    const key = '92b30ef73aba0e9531f56ed3e67666a8';
    const data = weatherBalloon(cityID, key);
    var celsius = data.main.temp;
    var time = modifiedEuler(celsius, coffeeTemperature);
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    console.log('The time until your coffee changes flavour palette is: ' + 
        minutes + 'minutes and' + seconds + 'seconds.');
}

function weatherBalloon(cityID, key) {
    var key = '{yourkey}';
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID +
        '&units=metric' + '&appid=' + key)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
      return data;
    })
    .catch(function() {
      // catch any errors
    });
}

function countryCheck() {
    // Function to take text input from user and return a country code
    var countryDataRaw = require('./utilities/countryCodes.json');
    var countryData = JSON.parse(countryDataRaw);
    var isValid = false;
    while (!isValid) {
        const countryName = prompt(messages.confirm_country);
        for (i = 0; i < countryData.length; i++) {
            var tempName = countryData[i].Name;
            if (countryName.equals(tempName)) {
                var countryCode = countryData[i].Code;
                isValid = true;
            }
        }
        console.log(messages.countryError);
    }
    return countryCode;
}

function cityCheck(countryCode) {
    // Function to take text input from user and return a city ID
    var cityDataRaw = require('./utilities/city.list.json');
    var cityData = JSON.parse(cityDataRaw);
    var isValid = false;
    while (!isValid) {
        const cityName = prompt(messages.confirmCity);
        for (j = 0; j < cityData.length; j++) {
            var tempName = cityData[j].name;
            var tempCountry = cityData[j].country;
            if (cityName.equals(tempName) && countryCode.equals(tempCountry)) {
                var cityID = cityData[j].id;
                isValid = true;
            }
        }
        console.log();
    }
    return cityID;
}

function coffeeCheck() {
    // Function to verify which kind of coffee the user drinks
    var coffeeData = [
        {"name": 'long black', "temperature": '80'},
        {"name": 'flat white', "temperature": '65'},
        {"name": 'latte', "temperature": '60'},
        {"name": 'cappuccino', "temperature": '70'}
    ];
    var isValid = false;
    var coffeeTemperature = 80; // Degrees Celsius

    while (!isValid) {
        const coffeeType = prompt(messages.coffeePreference);
        if (coffeeType >= 1 && coffeeType <= 4) {
            switch (coffeeType) {
                case '1':
                    coffeeTemperature = coffeeData[0].temperature;
                    isValid = false;
                    break;

                case '2':
                    coffeeTemperature = coffeeData[1].temperature;
                    isValid = false;
                    break;

                case '3':
                    coffeeTemperature = coffeeData[2].temperature;
                    isValid = false;
                    break;

                case '4':
                    coffeeTemperature = coffeeData[3].temperature;
                    isValid = false;
                    break;
            }
        }
        else {
            console.log(messages.coffeeError);
        }
    }
    return coffeeTemperature;
}

/// Function to approximate the temperature of the coffee using the modified Euler
/// method for approximating polynomials.
function modifiedEuler(cityTemperature, coffeeTemperature) {
    // Initialise known parameters
    startTime = 0;
    endTime = 40; // Minutes
    steps = endTime * 60; // Calculate total steps
    k = 0.1 // Positive constant for equation
    undrinkable = 40; // Temperature for when a coffee's flavour palette changes

    stepSize = (endTime - startTime) / steps; // Calculate step-size
    var timeArray = new Array(steps);
    var tempArray = new Array(timeArray.length);
    timeArray[0] = startTime;
    tempArray[0] = coffeeTemperature;

    // Fill 'timeArray' with time incrementing by step size
    for (i = 1; i < timeArray.length; i++) {
        timeArray[i] = timeArray[i - 1] + stepSize;
    }

    // Approximate the coffee temperature at each corresponding point in 'timeArray'
    for (j = 0; j < wArray.length - 1; j++) {
        k1 = stepSize * ((k * -1) * (tempArray[j] - cityTemperature));
        k2 = stepSize * ((k * -1) * (tempArray[j] + k1 - cityTemperature));
        tempArray[j + 1] = tempArray[j] + 1/2 * (k1 + k2);
    }

    // Perform iterations via for loop to calculate the time taken for the coffee
    // to become "undrinkable".
    for (k = 0; k < tempArray.length; k++) {
        temperature = tempArray[k];
        if (temperature < undrinkable) {
            minutesTotal = timeArray[k];
            break;
        }
    }

    return timeRemaining = minutes * 60; // Assign time until coffee is cold in seconds
}