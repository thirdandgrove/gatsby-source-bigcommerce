"use strict";

const BigCommerce = require("./bigcommerce");

const micro = require(`micro`);

const fetch = require("node-fetch");

const proxy = require("http-proxy-middleware");

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}, configOptions) => {
  const {
    createNode
  } = actions;
  const {
    endpoint,
    endpoints,
    clientId,
    secret,
    storeHash,
    accessToken,
    preview,
    nodeName,
    apiVersion
  } = configOptions;
  const bigCommerce = new BigCommerce({
    clientId,
    accessToken,
    secret,
    storeHash,
    apiVersion,
    responseType: "json"
  });

  if (!endpoint && !endpoints) {
    console.log("You have not provided a Big Commerce API endpoint, please add one to your gatsby-config.js");
    return;
  }

  const handleGenerateNodes = (node, name) => {
    return { ...node,
      id: createNodeId(node.id),
      bigcommerce_id: node.id,
      parent: null,
      children: [],
      internal: {
        type: name,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node)
      }
    };
  };

  endpoint ? // Fetch and create nodes for a single endpoint.
  await bigCommerce.get(endpoint).then(res => {
    // If the data object is not on the response, it could be v2 which returns an array as the root, so use that as a fallback
    const resData = res.data ? res.data : res;
    return resData.map(datum => createNode(handleGenerateNodes(datum, nodeName)));
  }) : // Fetch and create nodes from multiple endpoints
  await Promise.all(Object.entries(endpoints).map(([nodeName, endpoint]) => bigCommerce.get(endpoint).then(res => {
    // If the data object is not on the response, it could be v2 which returns an array as the root, so use that as a fallback
    const resData = res.data ? res.data : res;
    return resData.map(datum => createNode(handleGenerateNodes(datum, nodeName)));
  })));

  if (process.env.NODE_ENV === "development" && preview) {
    // make a fetch request to subscribe to webhook from BC.
    await fetch(`https://api.bigcommerce.com/stores/${storeHash}/${apiVersion || `v3`}/hooks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Auth-Client": clientId,
        "X-Auth-Token": accessToken
      },
      body: JSON.stringify({
        scope: "store/product/updated",
        is_active: true,
        destination: `${process.env.SITE_HOSTNAME}/___BCPreview`
      })
    }).then(res => res.json());
    const server = micro(async (req, res) => {
      const request = await micro.json(req);
      const productId = request.data.id; // webhooks dont send any information, just an id

      const newProduct = await bigCommerce.get(`/catalog/products/${productId}`);
      const nodeToUpdate = newProduct.data;

      if (nodeToUpdate.id) {
        createNode(handleGenerateNodes(nodeToUpdate, nodeName || `BigCommerceNode`));
        console.log("\x1b[32m", `Updated node: ${nodeToUpdate.id}`);
      }

      res.end("ok");
    });
    server.listen(8033, console.log("\x1b[32m", `listening to changes for live preview at route /___BCPreview`));
  }
};

exports.onCreateDevServer = ({
  app
}) => {
  app.use("/___BCPreview/", proxy({
    target: `http://localhost:8033`,
    secure: false
  }));
};