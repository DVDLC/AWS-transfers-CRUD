const defaultKeys = [
    "id",
    "validated",
    "inUse",
    "monto",
    "tipo",
    "fechaMovimiento",
    "fecha",
    "originName",
    "originRut",
    "originAccount",
    "receiverRut",
    "receiverAccount",
    "originBankCode",
    "originBankName",
    "comment",
    "originAccountType",
    "validatedAt",
    "createdAt",
    "updatedAt",
]

const validatetKeys = ( bodyParams ) => {

    const isCorrect = Object.keys( bodyParams ).every( key => defaultKeys.includes( key ))

    if(  Object.keys( bodyParams ).length === defaultKeys.length && isCorrect ) return true
    else return false
}

module.exports = {
    validatetKeys
}