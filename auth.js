const { Bearer } = require('permit')
var jwt = require('jsonwebtoken');
var UserController = require('./controllers/UserController')

// A permit that checks for HTTP Bearer Auth, falling back to a query string.
const permit = new Bearer({
  query: 'access_token',
})

exports.isLogged = async (req, res, next) => {
    // Try to find the bearer token in the request.
    const token = permit.check(req)

    // No token, that means they didn't pass credentials!
    if (!token) {
        permit.fail(res)
        res.status(404)
        res.json({message: 'Token no encontrado'})
    }

    try {
        var decoded = jwt.verify(token, process.env.APP_SECRET);
    } catch(err) {
        console.log(err);
        res.status(401)
        res.json({message: 'Token inválido'})
        return
    }

    // Authenticate the token however you'd like...
    const user = await UserController.getUserByToken(token)

    // No user, that means their credentials were invalid!
    if (!user) {
        permit.fail(res)
        res.status(401)
        res.json({message: 'Usuario no encontrado'})
    }

    req.user = user
    next()
}
