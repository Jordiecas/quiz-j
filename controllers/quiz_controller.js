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
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer=function(req, res){
	var resultado='Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.author=function(req, res){
	res.render('author', {autor:'Trueno', urlphoto:'/images/Trueno.jpg', errors: []});
};

// GET /quizes
exports.index=function(req, res){
	if(typeof(req.query.search) !== "undefined"){	//Ya definido en index.ejs. Estamos buscando
		var search='%'+req.query.search+'%';		//Añadimos % inicial y final
		search=search.replace(/ /g, '%');	//Suprimimos blancos
		models.Quiz.findAll({where: ["pregunta like ?", search], order:'pregunta ASC'}).then(function(quizes){
		res.render('quizes/index',{quizes: quizes, errors: []});
		}).catch(function(error){next(error);})
	}
	else{	//Primera entrada a preguntas
		models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index',{quizes: quizes, errors: []});
		}).catch(function(error){next(error);})
	}
};

// GET /quizes/new
exports.new=function(req, res){
	var quiz=models.Quiz.build( // crea objeto quiz
	{
		pregunta: "Pregunta", respuesta: "Respuesta"
	});
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create=function(req, res){
	var quiz=models.Quiz.build(req.body.quiz);
	
	var errors=quiz.validate();

	if (errors) {
		var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {// guarda en DB los campos pregunta y respuesta de quiz
		quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes')});	// Redirección HTTP (URL relativo) lista de preguntas
	}
};

// GET /quizes/:id/edit
exports.edit=function(req, res){
	var quiz=req.quiz;	// autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update=function(req, res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;

	var errors=req.quiz.validate();
	
	if (errors){
		var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/edit', {quiz: req.quiz, errors: errores});
	} else {
				req.quiz 	// save: guarda campos pregunta y respuesta en DB
				.save({fields: ["pregunta", "respuesta"]})
				.then(function(){res.redirect('/quizes');});
				// Redirección HTTP a Lista de preguntas (URL relativo)
	}
};