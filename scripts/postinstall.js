// const fs = require("fs");
import * as fs from 'fs';

// const consola = require("consola");
import * as consola from 'consola';

(function () {
  // Create an .env file if one doesn't exist
  try {
    consola.info("Checking for .env file…");
    if (!fs.existsSync(".env")) {
      fs.createReadStream(".env.example").pipe(fs.createWriteStream(".env"));
      consola.success("Created .env file.");
    } else {
      consola.success("Detected .env file, skipping creation.");
    }
  } catch (error) {
    consola.error(error);
  }
})();
