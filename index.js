#!/opt/homebrew/bin/node

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const chalk = require('chalk');

const targetDirectory = process.argv[2];

function convertFilenameToJpg(originalName) {
  const [fileName] = originalName.split('.');
  return `${fileName}.jpg`;
}

async function resizePictures() {
  if (process.argv[2] === '-v') return console.log('1.0.0');
  try {
    console.log(targetDirectory);

    const files = await fs.readdir(targetDirectory);

    await Promise.all(
      files.map(async (file) => {
        const processedFile = path.join(process.cwd(), targetDirectory, file);
        try {
          const metadata = await sharp(processedFile).metadata();

          const format =
            metadata.width > metadata.height ? [1200, null] : [null, 1200];

          await sharp(processedFile)
            .rotate()
            .resize(...format)
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toFormat('jpg')
            .jpeg({ quality: 90 })
            .toFile(path.join(process.cwd(), convertFilenameToJpg(file)));

          console.log(chalk.green(`${file} correctly resized`));
        } catch (err) {
          if (
            err.message === 'Input file contains unsupported image format'
          ) {
            console.warn(
              `${chalk.bgYellow('WARN')} ${chalk.yellow(
                `The file extension is not supported. The file ${file} is being skipped`
              )}`
            );
          } else {
            console.error(chalk.red(err.message));
          }
        }
      })
    );

    console.log(chalk.green('Files successfully resized'));
  } catch (err) {
    console.error(chalk.red(err.message));
  }
}

resizePictures();