var models=require('../models/models.js');

exports.statistics=function(req, res){
	models.Quiz.findAll({include: [{model: models.Comment}]}).then(function(quizes){
		res.render('quizes/statistics', {quizes: quizes, errors: []});
		}).catch(function(error){next(error);})
};
