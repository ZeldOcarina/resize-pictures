#!/usr/bin/env node

const { readdir } = require("fs");
const path = require("path");
//const { rename, readdir } = fs.promises;

const sharp = require("sharp");
const chalk = require("chalk");

const targetDirectory = process.argv[2];

async function resizePictures() {
  try {
    console.log(targetDirectory);
    readdir(targetDirectory, async (err, files) => {
      try {
        for (const file of files) {
          //console.log(path.join(process.cwd(), targetDirectory, file));

          const processedFile = path.join(process.cwd(), targetDirectory, file);
          const metadata = await sharp(processedFile).metadata();
          const format =
            metadata.width > metadata.height ? [1200, null] : [null, 1200];

          await sharp(processedFile)
            .rotate()
            .resize(...format)
            .toFormat("jpg")
            .jpeg({ quality: 90 })
            .toFile(path.join(process.cwd(), file));
        }
      } catch (err) {
        console.error(chalk.red(err.message));
      }
    });
    console.log(chalk.green("Files successfully resized"));
  } catch (err) {
    console.error(chalk.red(err.message));
  }
}
resizePictures();
