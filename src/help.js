import chalk from 'chalk';

const menus = {
    main: `
        ${chalk.greenBright('coffee [command]')}
            ${chalk.blueBright('calculate')} ........ calculate how long until your coffee is cold
            ${chalk.blueBright('version')} ............ show package version
            ${chalk.blueBright('help')} ............ show help menu
            ${chalk.blueBright('more-info')} .......... more information on how the calculation works
    `,
    more: `
        ${chalk.greenBright('coffee more-info')}
            ${chalk.blueBright('Did you know')}, a hot cup of coffee exposed to the air will cool down
            as it loses heat ${chalk.blueBright('proportional')} to its surroundings?
            ${chalk.blueBright("Newton's law of cooling")} states that the rate of cooling at the surface
            is proportional to the difference between the temperature of the coffee, ${chalk.blueBright('C')},
            and the temperature of the surrounding air, ${chalk.blueBright('A')}. This can be modelled by the
            following ODE:
                dC/dt = -k(C - A)
            Where, ${chalk.blueBright('k')} is a positive constant. Using this ODE, I am able to then calculate
            how long you have until your coffee is approximately going to change from the aromas of 'earthy', 'roasted',
            and 'intense' to a more bitter flavour which is commonly encountered at approximately ${chalk.blueBright('40 degrees Celsius')}.
            For more information, please view the article in the following link:
                ${chalk.magentaBright('https://perfectdailygrind.com/2019/11/how-temperature-can-impact-your-experience-of-coffee/')}
    `
}

export async function help(args) {
    console.log(menus.main);
}

export async function moreInfo(args) {
    console.log(menus.more);
}

// TODO: Add additional help with commands and locations, i.e. how to enter for certain countries and the like.