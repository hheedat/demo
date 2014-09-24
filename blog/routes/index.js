
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };

var crypto = require('crypto');
User = require('../models/user.js');

module.exports = function(app){

	app.get('/',function(req,res){
		res.render('index',{
			title:'主页',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});

	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg',{
			title:'注册',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		if(password!=password_re){
			req.flash('error','两次输入的密码不一致！');
			return res.redirect('/reg');
		}
		//生成密码的md5值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name:req.body.name,
			password:password,
			email:req.body.email
		});

		//检查用户名是否已经存在
		User.get(newUser.name,function(err,user){
			if(user){
				req.flash('error','用户已经存在！');
				return res.redirect('/reg');
			}

			newUser.save(function(err,user){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success','注册成功!');
				res.redirect('/');
			});
		});
	});

	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
			title:'登录',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		User.get(req.body.name,function(err,user){
			if(!user){
				req.flash('error','用户不存在！');
				return res.redirect('/login');
			}
			if(user.password!=password){
				req.flash('error','密码错误！');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登录成功');
			res.redirect('/');
		});
	});

	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		res.render('post',{title:'发表'});
	});

	app.post('/post',checkLogin);
	app.post('/post',function(req,res){

	});

	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','登出成功！');
		res.redirect('/');
	});

	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','未登录！');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req,res,next){
		if(req.session.user){
			req.flash('error','已登录！');
			res.redirect('back');
		}
		next();
	}

} 