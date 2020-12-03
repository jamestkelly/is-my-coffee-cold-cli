# is-my-coffee-cold-cli
This repository houses a simple program to calculate how long until a coffee in a given location changes its flavour palette. The program works by gathering supplied user information of their city, country, and coffee preference, then fetches the weather data for their supplied location. With the temperature data, the program then calculates in-line with Newton's law of cooling and the modified Euler method, how long the user has until their coffee becomes "cold" and changes its flavour palette.

To run this command line tool, assuming you have npm and Node.js already installed, then type from the command line;
  cd <folder-location>
  npm install
  coffee calculate
