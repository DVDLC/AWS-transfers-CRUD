
let data = []
const formatData = ( transfers ) => {
    transfers.forEach( element => {

        const { id, ...props } = element

        data = [
            ...data,
            {
                PutRequest:{
                    Item:{
                        id,
                        ...props
                    }
                }
            }
        ]
    }) 

    return data
}

module.exports = formatData