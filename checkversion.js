const package = require("./package.json");
const path = require("path");
const fs = require("fs");
const {name = "", version = ""} = package;

const checkVersion = () => {
  const file = `${name}-${version}.bundle.js`;
  const filePath = path.resolve(__dirname, "dist/cjs", file);

  return fs.existsSync(filePath);
};

if(checkVersion(package.version)) {
    console.log(`${package.name}-${package.version} already exists in dist/cjs`);
    process.exit(1)
} else {
    console.log(`${package.name}-${package.version} does not exist in dist/cjs and is being created`);
    process.exit(0)
}
