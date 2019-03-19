# gatsby-source-bigcommerce

This source plugin makes Big Commerce api data available in gatsby.js sites

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
        ...
      }
    }
  ]
};
```

## Configuration options

follows [node-bigcommerce](https://github.com/getconversio/node-bigcommerce) api

example configuration:

```
options: {

  // REQUIRED
  clientId: 'yourClientID',
  secret: 'YourClientSecret',
  accessToken: 'yourAccessToken',
  storeHash: 'yourSiteHash',
  endpoint: '/catalog/products',

  // OPTIONAL
  logLevel: 'info',
  nodeName: 'BigCommerceNode',

  // Multiple endpoints in an object.
  endpoints: {
        BigCommerceProducts: "/catalog/products",
        BigCommerceCategories: "/catalog/categories",
      }
}
```

## How to query

```
{
  allBigCommerceNode {
    edges{
      node{
        name
        price
        id
        sku
      }
    }
  }
}
```

#### credit

thanks to all the contributors to [node-bigcommerce](https://github.com/getconversio/node-bigcommerce)
