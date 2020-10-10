const qrImages=require("qr-image")

module.exports = {
    generateQr: async function () {
        var svg_string = await qrImages.imageSync('https://logycodetest.s3.amazonaws.com/s3Bucketoo0.6495583776676084-1579255250456.pdf', { type: 'svg' });
        console.log(svg_string);
    },
};