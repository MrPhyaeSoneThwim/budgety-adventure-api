const fs = require("fs-extra");

const unLink = async (filePath) => {
  if (await fs.pathExists(filePath)) {
    fs.remove(filePath, (err) => {
      if (err) throw new Error(err.message);
    });
  }
};

module.exports = unLink;
