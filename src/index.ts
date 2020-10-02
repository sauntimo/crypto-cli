#!/usr/bin/env node

import dotenv from 'dotenv';
import chalk from 'chalk';
import fetch from 'node-fetch';
import path from 'path';

interface ICommandArgs {
  asset: string;
  fiat: string;
}

interface IQuoteData {
  localisedPrice: string;
  change: number;
}

// get API key from .env file into process.env
dotenv.config({path: path.join(__dirname + '/../.env')});

const cmcBaseUrl = 'https://pro-api.coinmarketcap.com';

/**
 * Get a price of a cyptocurrency in a fiat currency
 * @param asset the symbol of a crypto currency
 * @param fiat the symbol of a fiat currency
 */
const fetchQuote = async (asset: string, fiat: string): Promise<IQuoteData> => {

  const endpoint = '/v1/cryptocurrency/quotes/latest';
  const queryData: Record<string, string> = {
    symbol: asset,
    convert: fiat,
  };
  
  const query = '?' + new URLSearchParams(queryData).toString();
  
  const response = await fetch(cmcBaseUrl + endpoint + query, {
    headers: {
      'Content-Type': 'application/json',
      'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
    },
  });

  const data = await response.json();

  if (data?.status?.error_code === 1001) {
    throw new Error(`Invalid API key.
      Crypto-cli expects a .env file in its root with a valid CMC_API_KEY value. 
      Go to https://coinmarketcap.com/api/ to obtain an API key for free.
      `);
  }

  // successful requests where bad input resulted in no data
  if (!response.ok && typeof data?.status?.error_code === 'number'){
    throw new Error(data.status.error_message);
  }

  if (!response.ok) {
    throw new Error(`Bad response from server: ${response.statusText}`);
  }

  const quote = data.data[asset].quote[fiat];
  const change = parseFloat(quote.percent_change_24h);
  const localisedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: fiat
  }).format(quote.price);

  return {localisedPrice, change}
}


/**
 * Get a crypto asset price and print it to the command line
 * @param asset the symbol of a crypto currency
 * @param fiat the symbol of a fiat currency
 */
const returnResult = async (asset: string, fiat: string): Promise<void> => {

  const {localisedPrice, change} = await fetchQuote(asset, fiat);

  console.log(
    chalk.bgCyan.white.bold('Crypto-CLI'),
    chalk.blue(`1 ${asset} = ${localisedPrice}`),
    chalk.white(`24hr change:`),
    chalk[change >= 0 ? 'green' : 'red'](
      (change > 0 ? '+' : '') + change.toFixed(2) + '%'
    ),
  );
}


/**
 * Check that the correct number of arguments were specified and return them
 */
const parseArgs = (): ICommandArgs => {

  // missing required arguments
  if (process.argv.slice(2).length !== 2) {
    throw new Error(`Incorrect number of arguments specified. Usage: crypto [asset] [fiat currency]`);
  }

  return {
    asset: process.argv[2].toUpperCase(),
    fiat: process.argv[3].toUpperCase()
  };
}

/**
 * Wrapper function for async error handling
 */
const main = async () => {
  try {
    const {asset, fiat} = parseArgs();
    await returnResult(asset, fiat);
  } catch (err) {
    console.log(
      chalk.bgCyan.white.bold('Crypto-CLI'),
      chalk.red(err)
    );
    process.exit(1);
  }  
}

main();
