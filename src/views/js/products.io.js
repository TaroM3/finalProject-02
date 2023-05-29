let socket = io()


socket.on('')

const addToMyCart = (_id) => {
    console.log(_id)
    socket.emit('addProductToMyCart', {_id: _id})
}