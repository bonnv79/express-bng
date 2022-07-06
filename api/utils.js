const { connectToDatabase } = require("../db/mongodb");
const package = require("../package.json");

const getVersion = () => package?.version;

const version = getVersion();

const handleSuccess = (res, { data, ...options }) => {
  res.send({
    status: 200,
    message: "Get data has successfully",
    version,
    data,
    ...options
  });
}

const handleError = (res, { error, ...options }) => {
  console.error(error);
  return res.status(500).send({
    status: 500,
    message: 'Server error',
    version,
    error,
    ...options
  });
}

module.exports = {
  getVersion,
  handleSuccess,
  handleError,
}