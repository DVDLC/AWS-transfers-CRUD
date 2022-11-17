const AWS      = require( 'aws-sdk' )
const dynamoDB = new AWS.DynamoDB.DocumentClient()

const fetchTransfersID = async( id ) => {

    const res = await dynamoDB.get({
        TableName: process.env.TABLE_NAME,
        Key: { id },
    }).promise()

    return res

}

module.exports = {
    fetchTransfersID
}