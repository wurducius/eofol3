const fs = require("fs");
const path = require("path");
const {
  FILENAME_SUFFIX_VDOM,
  FILENAME_SUFFIX_INSTANCES,
} = require("../constants/paths");
const { config } = require("../constants/compile");

const writeInstances = (eofolInstances, internalDir, viewName) => {
  const targetInstancesFilename = `${viewName}${FILENAME_SUFFIX_INSTANCES}`;
  const targetInstancesPath = path.resolve(
    internalDir,
    targetInstancesFilename,
  );
  fs.writeFileSync(
    targetInstancesPath,
    JSON.stringify(eofolInstances, null, config.minifyRegistryJSON ? 0 : 2),
  );
};

const writeVdom = (vdom, internalDir, viewName) => {
  const targetVDOMFilename = `${viewName}${FILENAME_SUFFIX_VDOM}`;
  const targetVDOMPath = path.resolve(internalDir, targetVDOMFilename);
  fs.writeFileSync(
    targetVDOMPath,
    JSON.stringify(vdom[0], null, config.minifyRegistryJSON ? 0 : 2),
  );
};

const writeInternal = (vdom, eofolInstances, internalDir, viewName) => {
  writeVdom(vdom, internalDir, viewName);
  writeInstances(eofolInstances, internalDir, viewName);
};

module.exports = writeInternal;
