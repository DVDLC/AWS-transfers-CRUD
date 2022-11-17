// Libraries
const AWS    = require( "aws-sdk" )
const moment = require("moment/moment")
const uuid   = require( 'uuid' )
require( 'dotenv' ).config()
// Utils
const { validatetKeys } = require("../utils/validateKeys.util")
const { fetchTransfersID } = require("../utils/fetchTransfersID")
const Responses = require("../utils/errorHandler")
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
            return Responses._400({ ok: false, msg: 'Revisa que la claves(keys) sean correctas' })
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
        return Responses._500( e )
    }
}

// GET ALL TRANSFERS - GET
const getAllTransfers = async( event ) => {

    // TODO: cambiar a querys
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

    const res  = await fetchTransfersID( id )
    const data = res.Item

    if( !data ) return Responses._404({ 
        ok: false, 
        msg: `Transfer with id: ${id} does not exist` 
    })

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

    return Responses._200({ 
        ok: true, msg: 
        'Successful info update' 
    })
} 

// DELETE TRANSFER - DELETE
const deleteTransfer = async( event ) => {

    const { id } = event.pathParameters
    const updatedAt = moment().toISOString()

    const res  = await fetchTransfersID( id )
    const data = res.Item


    if( !data ) Responses._404({ 
        ok: false, 
        msg: `Transfer with id: ${id} does not exist` 
    })

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

    
    return Responses._200({ 
        ok: true, 
        msg: 'Successful transfer' 
    })
} 


module.exports = {
    createTransfer,
    getAllTransfers,
    updateTransfer,
    deleteTransfer
}