const pdftk = require('node-pdftk');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sizeOf = require('image-size');
const sharp = require('sharp');

const rootFolder = 'aspekte/b1';
const basePath = '.';
const originalFolder = `${rootFolder}/deutsch`;
const targetFolder = `${rootFolder}/russian`;
const splitFolder = `${rootFolder}/split`;
const originalPDFFile = './Glossar.pdf';
const pdfExtension = '.pdf';
const imageExtension = '.png';
const imageFormat = 'png';

const createFolder = (path) => {
    let basePath = '.'
    const paths = path.split('/').reduce((res, p) => {
        res.push(`${res[res.length - 1]}/${p}`)
        return res
    }, [basePath])

    paths.forEach(p => {
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p)
        }
    })
}

const splitPdf = async (file) => {
    const pdf = pdftk
    await pdftk
        .input(originalPDFFile)
        .burst()
        .then(() => {
            // There is no output - files will be created in working directory
            // You'll have to use 'fs' to read them here
        })

    const filesToMove = fs.readdirSync('.')
        .filter(filename => 
            path.extname(filename) === pdfExtension
            && filename !== originalPDFFile.split('/')[originalPDFFile.split('/').length - 1]
        )
    
    Promise.all(filesToMove.map(filename => {
        fs.renameSync(`${basePath}/${filename}`, `${splitFolder}/${filename}`);
    }))

    return filesToMove.map(filename => `${splitFolder}/${filename}`);
}

const imageToPdf = (filepath) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filepath)) {
            reject(`File ${filepath} wasn't found`);
        }

        exec(`pdftoppm -${imageFormat} ${filepath} ${filepath.replace(pdfExtension, '')}`, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
            }
            const imageFilepath = filepath.replace(pdfExtension, `-1${imageExtension}`)
            const imageFilename = imageFilepath.split('/')[imageFilepath.split('/').length - 1]
            
            fs.unlinkSync(filepath)

            fs.copyFileSync(imageFilepath, `${targetFolder}/${imageFilename}`)
            fs.copyFileSync(imageFilepath, `${originalFolder}/${imageFilename}`)

            resolve({
                filepath: imageFilepath,
                original: `${originalFolder}/${imageFilename}`,
                target: `${targetFolder}/${imageFilename}`,
            });
        })
    })
}

const extractImage = (image, offset) => {
    return new Promise((resolve, reject) => {
        const imagePath = image.split('/').slice(0, -1).join('/')
        const imageName = image.split('/').slice(-1)
        const copyImage = `${imagePath}/copy-${imageName}`
        fs.copyFileSync(image, copyImage)
        sharp(copyImage).extract({
            left: offset.left,
            top: offset.top,
            width: offset.width, // + offset.left,
            height: offset.height, // + offset.top,
        })
        .toFile(image, err => {
            if (err) {
                reject(err)
            }
            fs.unlinkSync(copyImage);
            resolve(image)
        })
    })
}

const getDimemsions = (image) => {
    const dimensions = sizeOf(image);
    return dimensions;
}

fs.rmdirSync(originalFolder, { recursive: true })
fs.rmdirSync(targetFolder, { recursive: true })
fs.rmdirSync(splitFolder, { recursive: true })
createFolder(rootFolder);
createFolder(originalFolder);
createFolder(targetFolder);
createFolder(splitFolder);

splitPdf(originalPDFFile)
    .then(async (files) => {
        const images = await Promise.all(files.map(imageToPdf));
        const result = await Promise.all(images.map(async ({
            original,
            target
        }) => {
            const res = await Promise.all([
                extractImage(original, originalOffset),
                extractImage(target, targetOffset),
            ])
            return res;
        }))
        console.log(result);
    });

const mainOffset = {
    top: 150,
    right: 113,
    bottom: 136,
    left: 156,
    height: 1468,
    width: 972,
}

const originalOffset = {
    top: 150,
    right: 113,
    bottom: 136,
    left: 156,
    height: 1468,
    width: 503,
}

const targetOffset = {
    top: 150,
    right: 582,
    bottom: 136,
    left: 659,
    height: 1468,
    width: 469,
}