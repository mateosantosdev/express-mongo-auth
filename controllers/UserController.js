var jwt = require('jsonwebtoken');
const mongoose = require('mongoose').set('debug', false),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var db = require('../db')

var helpers = require('../helpers')
var User = mongoose.model('User');

exports.all = (req, res, next) => {
	User.find({}, function(err, users){
		if(err){
			res.status(400)
			res.json(err)
			return
		}
		
		res.json({users: users})
	})
}

exports.signup = (req, res, next) => {
	var email = req.body.email
	
	if(!email){
		res.status(400)
		res.json({'message': 'El email es obligatorio'})
		return
	}

    var user = new User();
	user.email = email;
	user.role = 'normal';
	user.setPassword(req.body.password);
	
	var token = user.generateJwt();

	user.tokens = [token];
	

	user.save(function (err) {
		if (err){
			helpers.saveErrorLog(err);

			res.status(400)
			res.json(err)
		}else {
			res.json(user);
		}
	});
}

exports.login = async (req, res, next) => {
	var email    = req.body.email
	var password = req.body.password
	
	var errors = []
	
	if(!email){
		errors.push('El email es obligatorio')
	}

	if(!password){
		errors.push('La contraseña es obligatoria')
	}

	if(errors.length > 0){
		res.status(400)
		res.json({'message': errors.join(", ")})
		return
	}

	var user = await User.findOne({email: email})

	if(!user){
		res.status(404)
		res.json({'message': 'No hemos encontrado el usuario'})
		return
	}

	// Comprobamos contraseña
	if (!user.validPassword(password)) {
		res.status(401)
		res.json({'message': 'La contraseña es incorrecta'})
		return
      }

	token = user.generateJwt();
	user.tokens = user.tokens.concat(token);
	user.save();

	res.json(user)
}

exports.forgot = async (req, res, next) => {
	var email    = req.body.email
	var temp_password = Math.random().toString(36).slice(-8)
	
	var errors = []
	
	if(!email){
		errors.push('El email es obligatorio')
	}

	if(errors.length > 0){
		res.status(400)
		res.json({'message': errors.join(", ")})
		return
	}

	var user = await User.findOne({email: email})

	if(!user){
		res.status(404)
		res.json({'message': 'No hemos encontrado el usuario'})
		return
	}

	user.setPassword(temp_password);

	user.save();

	res.json({temp_password: temp_password})	
}

exports.changePassword = async (req, res, next) => {
	//console.log(req);
	var password = req.body.password

	if(!password){
		res.status(400)
		res.json({'message': 'La contraseña es obligatoria'})
	}

	req.user.setPassword(password);

	req.user.save()

	res.json({'message': 'Contraseña cambiada correctamente'})
}

exports.getUserByToken = async (token) => {
	
	var user = await User.findOne({tokens: token})

	if(!user){
		return false
	}

	return user
}