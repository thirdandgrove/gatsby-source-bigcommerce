const BigCommerce = require('./bigcommerce');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  const bigCommerce = new BigCommerce({
    clientId: configOptions.clientId,
    accessToken: configOptions.accessToken,
    secret: configOptions.secret,
    storeHash: configOptions.storeHash,
    responseType: 'json'
  });

  // TODO: let user define multiple endpoints?
  // TODO: handle schema validation

  if (!configOptions.endpoint) {
    console.log(
      'You have not provided a Big Commerce API endpoint, please add one to your gatsby-config.js'
    );
    return;
  }
  const handleGenerateNodes = node => {
    const nodeId = createNodeId(`randomUser-${node.id}`);
    const nodeContent = JSON.stringify(node);
    const nodeData = Object.assign({}, node, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `BigCommerceNode`,
        content: nodeContent,
        contentDigest: createContentDigest(node)
      }
    });
    return nodeData;
  };

  return bigCommerce
    .get(configOptions.endpoint)
    .then(res => res.data.map(datum => createNode(handleGenerateNodes(datum))));
};
