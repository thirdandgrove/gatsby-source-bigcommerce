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
    const nodeId = createNodeId(node.id);
    const nodeContent = JSON.stringify(node);
    const nodeData = Object.assign({}, node, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: name,
        content: nodeContent,
        contentDigest: createContentDigest(node)
      }
    });
    return nodeData;
  };

  if (configOptions.endpoint) {
    // Fetch and create nodes for a single endpoint.
    return bigCommerce.get(configOptions.endpoint).then(res => res.data.map(datum => createNode(handleGenerateNodes(datum, configOptions.nodeName || `BigCommerceNode`))));
  } else {
    // Fetch and create nodes from multiple endpoints
    return Object.entries(configOptions.endpoints).map(([nodeName, endpoint]) => bigCommerce.get(endpoint).then(res => res.data.map(datum => createNode(handleGenerateNodes(datum, nodeName)))));
  }
};