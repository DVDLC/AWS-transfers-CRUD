
const Responses = require('../utils/errorHandler');



const pruebas = async( event ) => {
    
    return Responses._401({ msg: 'missing if from path' })

    
};

module.exports = { pruebas }