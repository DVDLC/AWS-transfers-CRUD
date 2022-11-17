// Libraries
const AWS    = require( "aws-sdk" )
const moment = require("moment/moment")
const uuid   = require( 'uuid' )
require( 'dotenv' ).config()
// Utils
const { validatetKeys } = require("../utils/validateKeys.util")
const { ApiError, errorHandler } = require("../utils/errorHandler")
const { HttpStatusCode } = require("../utils/httpStatusCode")
const { fetchTransfersID } = require("../utils/fetchTransfersID")
// Variables
const dynamoDB = new AWS.DynamoDB.DocumentClient()

// CREATE TRANSFER - POST
const createTransfer = async( event ) => {
    
    try{
        const { ...props } = JSON.parse( event.body )
        const id = uuid.v4()
        const dateNow = moment()
        
        const nwTransfer = {
            id,
            createdAt: dateNow.toISOString(),
            fechaMovimiento: dateNow.valueOf(),
            fecha: dateNow.format( "DD-MM-YYYY HH:mm" ),
            validated  : false,
            inUse      : false,
            validatedAt: null,
            updatedAt  : null,
            ...props,
        }

        // Validación nwTransfer cumple con las llaves permitidas
        const isCorrectKeys = validatetKeys( nwTransfer )
        if( !isCorrectKeys ){
            throw new ApiError( 
                'Asegurate que la claves(keys) sean correctas',
                HttpStatusCode.BAD_REQUEST
            )
        }
                
        await dynamoDB.put({
            TableName: process.env.TABLE_NAME,
            Item: nwTransfer
        }).promise()

        return {
            ok: true,
            msg: 'POST - create transfer',
            nwTransfer
        }

    }catch( e ){
        errorHandler( e )
    }
}

// GET ALL TRANSFERS - GET
const getAllTransfers = async( event ) => {

    const res = await dynamoDB.scan({
        TableName: process.env.TABLE_NAME
    }).promise()

    const count = res.Count
    const transfers = res.Items
        
    return{
        count,
        transfers
    }
} 

// UPDATE INFO TRANSFER - PATCH
const updateTransfer = async( event ) => {

    const { id } = event.pathParameters
    const { comment, monto, ...props } = JSON.parse( event.body )
    const updatedAt = moment().toISOString()
    let response = {}

    const res  = await fetchTransfersID( id )
    const data = res.Item

    if( !data ) response = { 
        statusCode: 404, 
        msg: `Transfers with id: ${ id } does not exist` 
    }

    await dynamoDB.update({
        TableName: process.env.TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #cm = :comment, #mt = :monto, #ua = :updatedAt',
        ExpressionAttributeValues: {
            ':comment': comment,
            ':monto': monto,
            ':updatedAt': updatedAt,
        },
        ExpressionAttributeNames: {
            '#cm': "comment",
            '#mt': "monto",
            '#ua': "updatedAt"
        },
        ReturnValues: 'ALL_NEW'
    }).promise()

    response = { 
        ok: true,
        msg: 'Successful info update' 
    }

    return response
} 

// DELETE TRANSFER - DELETE
const deleteTransfer = async( event ) => {

    const { id } = event.pathParameters
    const updatedAt = moment().toISOString()

    const res  = await fetchTransfersID( id )
    const data = res.Item
    let response = {}

    if( !data ) response = { 
        statusCode: 404, 
        msg: `Transfers with id: ${ id } does not exist` 
    }

    await dynamoDB.update({
        TableName: process.env.TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #vd = :validated, #ua = :updatedAt',
        ExpressionAttributeValues: {
            ':validated': true,
            ':updatedAt': updatedAt
        },
        ExpressionAttributeNames: {
            '#vd': 'validated',
            '#ua': 'updatedAt'
        },
        ReturnValues: 'ALL_NEW'
    }).promise()

    response = {
        ok: true,
        msg: 'Successful transfer'
    }
    return response
} 


module.exports = {
    createTransfer,
    getAllTransfers,
    updateTransfer,
    deleteTransfer
}