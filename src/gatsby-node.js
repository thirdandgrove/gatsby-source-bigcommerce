const BigCommerce = require('node-bigcommerce');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  // validate options from user config
  // create bigcommerce instace

  const bigCommerce = new BigCommerce({
    clientId: configOptions.clientId,
    accessToken: configOptions.accessToken,
    responseType: 'json'
  });

  // TODO: let user define multiple endpoints?
  // TODO: handle schema validation
  bigCommerce.get('/products').then(data => {
    // Catch any errors, or handle the data returned
  });
};
