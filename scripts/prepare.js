const pkg = require("../package");
const fs = require("fs");

delete pkg.devDependencies;
delete pkg.scripts;

fs.writeFileSync("_publish/package.json", JSON.stringify(pkg));