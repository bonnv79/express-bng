const package = require("../package.json");

const getVersion = () => package?.version;

module.exports = {
  getVersion
}