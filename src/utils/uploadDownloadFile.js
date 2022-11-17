const AWS = require( 'aws-sdk' )
const S3 = new AWS.S3()


const getFile = async( downloadParms ) => {
    const res = await S3.getObject( downloadParms, ( err, data ) => {
        if (err) console.log(err);
        else     console.log( 'succesfully download!!!' )
    }).promise()

    return res
}


const upload = async( uploadParams ) => {
    const res = await S3.upload( uploadParams, ( err, data ) => {

        if (err) console.log(err);
        else     console.log( 'succesfully uploaded!!!' )
    }).promise()

    return res
}

module.exports = {
    upload,
    getFile
}