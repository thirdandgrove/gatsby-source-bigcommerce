# gatsby-source-bigcommerce

This source plugin makes Big Commerce api data available in gatsby.js

## Installation

```
# Install the plugin
yarn add gatsby-source-bigcommerce
```

in `gatsby-config.js`

```
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-bigcommerce',
      options: {
        // options
      }
    }
  ]
};
```

## Configuration options

follows node-bigcommerce sdk

example configuration:

```
options: {
  logLevel: 'info',
  clientId: 'hjasdfhj09sasd80dsf04dfhg90rsds',
  secret: 'odpdf83m40fmxcv0345cvfgh73bdwjc',
  callback: 'https://mysite.com/bigcommerce'
  accessToken: 'ly8cl3wwcyj12vpechm34fd20oqpnl',
  storeHash: 'x62tqn',
}
```

## How to query

### TODO

- [ ] implement node-bigcommerce to wrap API
- [ ] implement node-fetch instead of https
- [ ] multiple endpoint support?
