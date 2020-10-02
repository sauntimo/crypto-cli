# Crypto-cli

Small command line app, written in typescript, to get crypto prices


### Installation

- clone the repo
  ```
  $ git clone git@github.com:sauntimo/crypto-cli.git crypto-cli
  ```
  
- initialise
  ```
  $ cd crypto-cli && sudo npm i -g 
  ```

- get an [API key](https://coinmarketcap.com/api/) from CoinMarketCap. They're free and it only takes a minute to sign up.

- add a `.env` file
  ```
  $ touch .env && echo 'CMC_API_KEY=[your API key]' >> .env
  ```

### Usage

```
$ crypto [asset] [fiat]
```

`asset` -  a symbol representing a crypto currency, eg "btc"

`fiat` - a symbol representing a fiat currency, eg "usd"

For example;
```
$ crypto btc usd
Crypto-CLI 1 BTC = US$10,614.90 24hr change: -1.88%
```





