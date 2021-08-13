#!/usr/local/bin/node

const { readdir } = require("fs");
const path = require("path");
//const { rename, readdir } = fs.promises;

const sharp = require("sharp");
const chalk = require("chalk");

const targetDirectory = process.argv[2];

async function resizePictures() {
  try {
    console.log(targetDirectory);
    let fileName;
    readdir(targetDirectory, async (err, files) => {
      try {
        for (const file of files) {
          const processedFile = path.join(process.cwd(), targetDirectory, file);
          fileName = file;
          try {
            const metadata = await sharp(processedFile).metadata();

            const format =
              metadata.width > metadata.height ? [1200, null] : [null, 1200];

            await sharp(processedFile)
              .rotate()
              .resize(...format)
              .toFormat("jpg")
              .jpeg({ quality: 90 })
              .toFile(path.join(process.cwd(), file));

            console.log(chalk.green(`${file} correctly resized`));
          } catch (err) {
            console.log(err);
            if (
              err.message === "Input file contains unsupported image format"
            ) {
              console.warn(
                `${chalk.bgYellow("WARN")} ${chalk.yellow(
                  `The file extension is not supported. The file ${fileName} is being skipped`
                )}`
              );
            } else {
              console.error(chalk.red(err.message));
            }
          }
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
