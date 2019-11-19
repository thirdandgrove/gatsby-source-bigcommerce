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
  apiVersion: 'v2'

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

## Preview

This currently supports use in Gatsby Cloud.
Preview **only supports product updates**
add the `preview` key to options as shown

```javascript
options: {
  preview: true;
}
```

Once your instance is deployed in Gatsby could, get your preview URL and add it as an environment variable under the key `SITE_HOSTNAME`.

Restart your instance and preview should be live.

#### credit

thanks to all the contributors to [node-bigcommerce](https://github.com/getconversio/node-bigcommerce)
