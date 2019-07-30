const express = require('express');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const User = require('../../models/Users');
const Token = require('../../models/Token');
const mailer = require('../../service/mailer');
const passport = require('passport');
const {ensureAuthenticatedErrorMessage,ensureAuthenticatedRedirect} = require('../../config/passport');
const url = require('url');
const { clientURI } = require('../../config/keys');
const router = express.Router();
let newUser;

// 소셜 로그인 로직
function socialLoginRedirect(service, req, res, next) {
  return passport.authenticate(service, async (err, user, info) => {
    const message = encodeURIComponent(info.message);
    const state = encodeURIComponent(info.state);
    const redirectURL = !info.url ? req.session.redirectTo : info.url;

    if (user){
      await req.logIn(user, (err)=>{
        if (err)
          next(err);
      })
    }

    delete req.session.redirectTo;
    
    res.redirect(`${redirectURL}/?message = ${message}&state = ${state}`);
  })(req, res, next)
}

// test용 router
router.get('/',ensureAuthenticatedRedirect ,(req,res) => {
  res.send(req.header);
});

// 회원가입 router
router.post('/register', (req, res, next) => {
  
  let email =  req.body.email;
  let password = User.hashPassword(req.body.password);
  let name = req.body.name;  
  
  // origin url
  let redirectURL = req.headers.referer;
  // history.push() => basename이 붙기 때문에 pathname을 추출한다. 
  redirectURL = new URL(redirectURL).pathname;

  newUser = new User ({
    email: email,
    password: password,
    name: name,
    address: null ,
    interests: null ,
    image: 'coverimg/defaultAvartar.png',
    sex: null ,
    birth: null ,
    about: null ,
  });
  // 유저가 존재하는지 확인 
  User.checkExistingUser(newUser)
    .then(dup => {
      // 가입하지 않은 경우 
      if (!dup){
        // 토큰 생성
        const secretToken = randomstring.generate();
        // 저장
        newUser.save()
          .then(() => {
            newToken = new Token({
              //userId
              _id: newUser._id,
              token: secretToken
            });
            // 토큰 document 저장
            newToken.save()
              .then(() => res.send({state: 'success', message:'회원가입에 성공했습니다.', url: '/signin'}))
              .catch(err => next(err));
        })
        .catch(err => next(err));
      }
      else {
        res.send({state: 'warning', message:'이미 가입한 아이디입니다.', url: redirectURL});
      }
    })
    .catch(err => next(err))
});

// Email을 통한 토큰 인증 router
router.get('/verify',(req, res , next)=>{
  const urlToken = req.query.token;
  // 일치하는 Token을 찾는다.
  Token.findOne({token: urlToken})
    .exec((err, token)=> {
      
      if (err) next(err)
      // redirect 추가
      if (!token){
        res.send({state: 'fail', message:'해당하는 토큰이 존재하지 않습니다.', url: `${clientURI}`})
      }
      else{
        User.update({_id: token._id},{ $set: {verified: true}})
          .exec((err,user)=>{
            if (err) next(err);
            res.send({state: 'success', message:'토큰 인증에 성공했습니다.', url: `${clientURI}`})
        });
      }
    })
});

// 로그인 router
router.post('/signin',(req, res, next) => {
  let redirectURL = req.headers.referer;
  // history.push() => basename이 붙기 때문에 pathname을 추출한다. 
  redirectURL = new URL(redirectURL).pathname;

  passport.authenticate('local', async (err, user, info) => {
    if (err) return next(err)
    
    if (user){
      await req.logIn(user, (err) => {
        if (err)
          next(err);
      })
    }
    info.url = info.url === null ? redirectURL : info.url;
    res.send(info);
  })(req, res, next)
})

// test 용 router
router.get('/session',(req, res, next) => {
  res.send(req.header)
});

router.post('/checkAuth',(req, res, next )=>{
  if (req.user){
    res.json({
      status : true,
      id : req.user._id,
      email : req.user.email,
      image: req.user.image,
      name: req.user.name,
      date: req.user.date,
    });
  }
  else{
    res.json({
      status : false,
      id: '',
      email : '',
      image: '',
      name: '',
    });
  }
});
// 로그아웃 router
router.post('/signout',(req, res, next)=>{
  req.logOut();
  res.send({
    status:false,
    email:''
  });
});

router.post('/delete', ensureAuthenticatedErrorMessage ,async (req, res, next)=>{
  const app = await User.findOne({ _id: req.user._id}).exec();
  await app.remove();
});

router.get('/google_auth',(req, res, next)=>{
  req.session.redirectTo = req.headers.referer;
  passport.authenticate('google', {scope: ['email','profile']})(req,res,next);
})

router.get('/google_auth/redirect', (req, res, next) => {
  socialLoginRedirect('google', req, res, next)
});

router.get('/naver_auth',(req, res, next)=>{
  req.session.redirectTo = req.headers.referer;
  passport.authenticate('naver')(req,res,next);
});

router.get('/naver_auth/redirect',(req, res, next) => {
  socialLoginRedirect('naver', req, res, next)
});

module.exports = router;