const BigCommerce = require('./bigcommerce');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  // validate options from user config
  // validation may be redundant and node-bigcommerce
  // logs errors when configs are not present
  // create bigcommerce instace

  const bigCommerce = new BigCommerce({
    clientId: configOptions.clientId,
    accessToken: configOptions.accessToken,
    responseType: 'json'
  });

  // TODO: let user define multiple endpoints?
  // TODO: handle schema validation
  return configOptions.endpoint
    ? bigCommerce.get(configOptions.endpoint).then(data => {})
    : console.log(
        'You have not provided a Big Commerce API endpoint, please add one to your gatsby-config.js'
      );
};
