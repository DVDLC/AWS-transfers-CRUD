const { HttpStatusCode } = require("./httpStatusCode")

const headers = {
    'Content-type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
}


const Responses = {
    _200( data = {} ){
        return{
            headers,
            statusCode: HttpStatusCode.OK,
            body: JSON.stringify( data )
        }
    },
    _400( data = {} ){
        return{
            headers,
            statusCode: HttpStatusCode.BAD_REQUEST,
            body: JSON.stringify( data )
        }
    },
    _401( data = {} ){
        return{
            headers,
            statusCode: HttpStatusCode.UNAUTHORIZATE,
            body: JSON.stringify( data )
        }
    },
    _404( data = {} ){
        return{
            headers,
            statusCode: HttpStatusCode.NOT_FOUND,
            body: JSON.stringify( data )
        }
    },
    _500( data = {} ){
        return{
            headers,
            statusCode: HttpStatusCode.NOT_FOUND,
            body: JSON.stringify( data )
        }
    }
}

module.exports = Responses