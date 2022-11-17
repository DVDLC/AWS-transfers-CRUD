// Libraries
const AWS  = require( 'aws-sdk' )
const path = require( 'path' );
const fs   = require( 'fs' )
// Utils
const { upload, getFile } = require('../utils/uploadDownloadFile');
const formatData = require('../utils/formatData');
// extras
require( 'dotenv' ).config()
const dynamoDB = new AWS.DynamoDB.DocumentClient()


const seed = async( event )=> {

    const downloadParms = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'transfers_back_test.json'
    }

    const res  = await getFile( downloadParms )
    const data = JSON.parse( res.Body )

    if( !data ){
        return {
            statusCode: 400,
            msg: 'data not found - check logs'
        }
    }

    const newData = formatData( data )
    const params  = {
        RequestItems: {
            [ process.env.TABLE_NAME ]: newData
        }
    }

    await dynamoDB.batchWrite( params )
        .promise()

    return {
        params
    }
}


// Función unicamente de ayuda para pruebas de AWS-S3
const uploadFile = async() => {

    const pathFile = path.basename( '../../transfers_back_test.json' )
    const transfers = fs.readFileSync( pathFile )

    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: pathFile,
        Body: transfers,
        ContentEncoding: 'base64',
        ContentType: 'application/json',
        ACL: 'public-read'
    }

    // Upload function
    const res = await upload( uploadParams )

    return {
        ok: true,
        body: res
    }
}


module.exports = {
    seed,
    uploadFile
}