var models=require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load=function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz=quiz;
				next();
			} else {next(new Error('No existe quizId='+quizId));}
		}).catch(function(error){next(error);});
};
// GET /quizes/:id
exports.show=function(req, res){
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer=function(req, res){
	var resultado='Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

exports.author=function(req, res){
	res.render('author', {autor:'Trueno', urlphoto:'/images/Trueno.jpg'});
};

// GET /quizes
exports.index=function(req, res){
	if(typeof(req.query.search) !== "undefined"){	//Ya definido en index.ejs. Estamos buscando
		var search='%'+req.query.search+'%';		//Añadimos % inicial y final
		search=search.replace(/ /g, '%');	//Suprimimos blancos
		models.Quiz.findAll({where: ["pregunta like ?", search], order:'pregunta ASC'}).then(function(quizes){
		/*quizes.sort(function(a,b){	//Ordenamos quizes
			var nameA=a.pregunta.toLowerCase(), nameB=b.pregunta.toLowerCase();
 			if (nameA < nameB) //sort string ascending
 				return(-1);
 			if (nameA > nameB) return(1);
 			return(0); //default return value (no sorting)
		});*/
		res.render('quizes/index',{quizes: quizes});
		}).catch(function(error){next(error);})
	}
	else{	//Primera entrada a preguntas
		models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index',{quizes: quizes});
		}).catch(function(error){next(error);})
	}
};

// GET /quizes/new
exports.new=function(req, res){
	var quiz=models.Quiz.build( // crea objeto quiz
	{
		pregunta: "Pregunta", respuesta: "Respuesta"
	});
	res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create=function(req, res){
	var quiz=models.Quiz.build(req.body.quiz);
	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes');
	})	// Redirección HTTP (URL relativo) lista de preguntas
};