var managers={
    "limit":10,
    "orderByHead":"createdAt",
    "orderByValue":"-1",
    "startPoint":0,
    "emailById":"_id",
    "sortBy":"-createdAt",
}

var pdfOptions={
    format: "A4",
    orientation: "landscape",
    border: "0mm"
}

var generatedFilesPrefix={
    default:"SACFPL"
}

var validation={
    "phoneNo":10
}

var preFixes={
    financialYear: "2021",
    airExport: {query:"AE"},
    oceanExport: {query:"OE"},
    oceanImport: {query:"OI"},
    oceanThirdParty: {query:"OT"},
    oceanDomestic: {query:"OD"},
    airImport: {query:"AI"},
    thirdParty: {query:"AT"},
    domestic: {query:"AD"},
}

var branchImages=[
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.8509788893962125-1579078747174.png",name:"Mumbai"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.47563918802734007-1579079154444.png",name:"Chennai"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.36555326719820136-1579079337771.jpg",name:"Kolkatta"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.22355773380737487-1579079917128.jpg",name:"Ahmedabad"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.2581208579506311-1579080029813.png",name:"Cochin"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.5110023481802344-1579080084526.png",name:"Delhi"},
    {url:"https://logycodetest.s3.us-east-2.amazonaws.com/s3Bucketoo0.3731450675424284-1585416799236.png",name:"hydrabad"},
]
var branchIataImages=[
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.19138509391873226-1579084211343.jpg",name:"iata"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.5185702173557565-1579084737150.jpg",name:"acaa"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.07164699497780136-1579084805781.png",name:"fiata"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.40328053279741916-1579084878310.png",name:"qcl"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.5089906643355089-1579084952811.png",name:"Netural"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.5148364781370365-1579085051537.png",name:"ACFI"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.0887545129839884-1579084268867.jpg",name:"WCA"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.3933187690620248-1579085130805.jpg",name:"MTO"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.18358729635484017-1579085218281.png",name:"FIEO"},
    {url:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.5913483920193889-1579085372038.jpg",name:"aeo"},
]

var companyDigitalMediaLinks={
    fb:{url:"https://www.facebook.com/SAConsultants-Forwarders-Pvt-Ltd-137401253026329/",imgUrl:"https://logycodetest.s3.us-east-2.amazonaws.com/s3Bucketoo0.41038939376883343-1579087198856.png",name:"Facebook"},
    linkedin:{url:"https://www.linkedin.com/company/s-a-consultants-&-forwarders-pvt-ltd-/",imgUrl:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.8109402079919319-1579087301327.png",name:"linkedin"}
}

var awbPdfBackgroundImageUrls={
    old:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.897293011137483-1580995267252.png",
    new:"https://logycodetest.s3.amazonaws.com/s3Bucketoo0.5262847376767656-1580708983698.jpeg",
    greyToWhite:"https://logycodetest.s3.us-east-2.amazonaws.com/s3Bucketoo0.20252946185209475-1580997903580.png"
}






//////air export
var airExport={}

let query={}
query.autoRevertWithPdfMailMessage="<p>Dear Sir/Madam,<br>" +
    "Thanks for your query.<br>" +
    "Kindly find attached the freight quote for the below mentioned consignment details.</p>"

query.autoRevertWithoutPdfMailMessage="<p>Dear Sir/Madam,<br>" +
    "Thanks for your query.<br>" +
    "Our CS Buddy will get back to you soon.</p>"

query.airlineIataMailMessage="<p>Dear Sir/Madam,<br>" +
    "Please advise the best rates as per below shipment details:-<br>";

query.awb="<p>Dear Sir/Madam,<br>" +
    "Thanks for your query.<br>" +
    "Kindly find attached awb copy for the below mentioned consignment details.</p>"

airExport.query=query


let AWB={}
AWB.declaredValCarriage="NVD"
AWB.declaredValCustoms="NCV"
AWB.amountOfInsurance="NIl"
AWB.handlingInfo="PLS INFORM CONSIGNEE IMMDLY ON ARRIVAL AT DESTINATION"
AWB.printingArray=["ORIGINAL 1 FOR ISSUING CARRIER","ORIGINAL 2 FOR ISSUING CONSIGNEE","ORIGINAL 2 FOR ISSUING CONSIGNEE","ORIGINAL 4 FOR ISSUING Delivery Reciept","ORIGINAL 5 FOR Airport of Destination","ORIGINAL 6 FOR THIRD CARRIER","ORIGINAL 7 FOR SECOND CARRIER","ORIGINAL 8 FOR FIRST CARRIER","ORIGINAL 9 FOR AGENT","ORIGINAL 10 FOR EXTRA COPY FOR CARRIER","ORIGINAL 11 FOR EXTRA COPY FOR CARRIER","ORIGINAL 12 FOR CUSTOMS"]

let HAWB={}
HAWB.printingArray=["ORIGINAL 3 FOR SHIPPER","ORIGINAL 1 FOR ISSUING AGENT","ORIGINAL 2 FOR CONSIGNEE","ACCOUNTS COPY","DESTINATION COPY","EXTRA COPY","EXTRA COPY"]

airExport.awb=AWB





//////Ocean export
var oceanExport={}

let queryOcean={}

queryOcean.autoRevertWithoutPdfMailMessage="<p>Dear Sir/Madam,<br>" +
    "Thanks for your query.<br>" +
    "Our CS Buddy will get back to you soon.</p>"

oceanExport.query=queryOcean



module.exports.managers = managers;
module.exports.validations = validation;
module.exports.pdfOptions = pdfOptions;
module.exports.preFixes = preFixes;
module.exports.branchImgs = branchImages;
module.exports.branchIataImages = branchIataImages;
module.exports.companyDigitalMediaLinks = companyDigitalMediaLinks;
module.exports.airExport = airExport;
module.exports.oceanExport = oceanExport;
module.exports.generatedFilesPrefix = generatedFilesPrefix;
module.exports.defaultCurrency = {code:"INR"};
module.exports.companyStamp = "https://logycodetest.s3.amazonaws.com/s3Bucketoo0.4159929777643603-1582651043719.png";
module.exports.companyData={
    name:"S.A. Consultants & Forwarders Pvt Ltd"
}
module.exports.elevtedIds={
    ids:["5e240f549a521516a0f110da"]
}