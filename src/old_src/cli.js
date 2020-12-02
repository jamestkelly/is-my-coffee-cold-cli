import minimist from 'minimist';
import chalk from 'chalk';
import Table from 'cli-table3';
import prompt from 'prompts'
import { version } from './version';
import { help, moreInfo } from './help';
import { rejects } from 'assert';
//import { startCalculate } from './coffeeCalculator';

const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

export async function main(argsArray) {
    const args = minimist(argsArray.slice(2));
    let cmd = args._[0] || 'help';

    if (args.version || args.v) {
        cmd = 'version';
    }

    if (args.help || args.h) {
        cmd = 'help';
    }

    switch(cmd) {
        case 'version':
            version(args);
            break;

        case 'help':
            help(args);
            break;

        case 'calculate':
            startCalculate(args);
            break;

        case 'more-info':
            moreInfo(args);
            break;

        default:
            console.error(`"${cmd}" is not a valid argument, please try again.`);
            break;
    }

}

function queryUser(question) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(question, resolve);
    });
}

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

function startCalculate(args) {
    console.log(messages.initialMessage);
    let countryCode = countryCheck();
    let  cityID = cityCheck(countryCode);
    console.log(cityID);
    /*
    var coffeeTemperature = coffeeCheck();
    const key = '92b30ef73aba0e9531f56ed3e67666a8';
    const data = weatherBalloon(cityID, key);
    var celsius = data.main.temp;
    var time = modifiedEuler(celsius, coffeeTemperature);
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    console.log('The time until your coffee changes flavour palette is: ' +
        minutes + 'minutes and' + seconds + 'seconds.'); */
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

function onErr(err) {
    console.log(err);
    return 1;
}

async function countryCheck() {
    var countryData = require('./utilities/countryCodes.json');
    var countryCode = "";
    let countryName = await queryUser(messages.confirmCountry);
    readlineInterface.pause();

    while (Boolean(countryCode) === false) {
        for (var i = 0; i < countryData.length; i++) {
            var tempName = countryData[i].Name;
            if (tempName === countryName) {
                countryCode = countryData[i].Code;
                break;
            }
        }
    }
    console.log(`Your ${chalk.blueBright('country code')} is: `, countryCode);
    return countryCode;
}

async function cityCheck(countryCode) {
    // Function to take text input from user and return a city ID
    var cityData = require('./utilities/city.list.json');
    var cityCode = 0;
    let cityName = await queryUser(messages.confirmCity);

    while (Boolean(cityCode) === false) {
        for (var i = 0; j < cityData.length; i++) {
            var tempName = cityData[i].name;
            var tempCountry = cityData[i].country;
            if (cityName === tempName && countryCode === tempCountry) {
                var cityCode = cityData[i].id;
            }
        }
    }

    if (Boolean(cityCode) === false) {
        console.log(messages.cityError);
    }
    else {
        console.log(`Your ${chalk.blueBright('city code')} is`, cityCode);
    }

    return cityCode;
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
        var coffeeType = parseInt(prompt(messages.coffeePreference));

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
    for (var i = 1; i < timeArray.length; i++) {
        timeArray[i] = timeArray[i - 1] + stepSize;
    }

    // Approximate the coffee temperature at each corresponding point in 'timeArray'
    for (var j = 0; j < wArray.length - 1; j++) {
        k1 = stepSize * ((k * -1) * (tempArray[j] - cityTemperature));
        k2 = stepSize * ((k * -1) * (tempArray[j] + k1 - cityTemperature));
        tempArray[j + 1] = tempArray[j] + 1/2 * (k1 + k2);
    }

    // Perform iterations via for loop to calculate the time taken for the coffee
    // to become "undrinkable".
    for (var k = 0; k < tempArray.length; k++) {
        temperature = tempArray[k];
        if (temperature < undrinkable) {
            minutesTotal = timeArray[k];
            break;
        }
    }

    return timeRemaining = minutes * 60; // Assign time until coffee is cold in seconds
}