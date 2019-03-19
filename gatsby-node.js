'use strict';

const BigCommerce = require('./bigcommerce');

exports.sourceNodes = ({
  actions,
  createNodeId,
  createContentDigest
}, configOptions) => {
  const {
    createNode
  } = actions;
  const bigCommerce = new BigCommerce({
    clientId: configOptions.clientId,
    accessToken: configOptions.accessToken,
    secret: configOptions.secret,
    storeHash: configOptions.storeHash,
    responseType: 'json'
  });

  if (!configOptions.endpoint && !configOptions.endpoints) {
    console.log('You have not provided a Big Commerce API endpoint, please add one to your gatsby-config.js');
    return;
  }

  const handleGenerateNodes = (node, name) => {
    return { ...node,
      id: createNodeId(`${name}-${node.id}`),
      parent: null,
      children: [],
      internal: {
        type: name,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node)
      }
    };
  };

  return configOptions.endpoint ? // Fetch and create nodes for a single endpoint.
  bigCommerce.get(configOptions.endpoint).then(res => res.data.map(datum => createNode(handleGenerateNodes(datum, configOptions.nodeName || `BigCommerceNode`)))) : // Fetch and create nodes from multiple endpoints
  Promise.all(Object.entries(configOptions.endpoints).map(([nodeName, endpoint]) => bigCommerce.get(endpoint).then(res => res.data.map(datum => createNode(handleGenerateNodes(datum, nodeName))))));
};