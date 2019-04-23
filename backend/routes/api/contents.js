const express = require('express');
const router = express.Router();
const Contents = require('../../models/Contents.js');
const multer = require('multer');
const maxSize = 50 * 1024 * 1024;
const basicImgPath = 'coverimg/study-basic.jpg';
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');


const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './coverimg/');
  },
  filename(req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage, 
  limits : { fileSize : maxSize },
  fileFilter : (req, file, callback) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/bmp') {
      req.fileValidationError = '이미지 파일 형식이 아닙니다.';
      return callback(null, false, new Error('이미지 파일 형식이 아닙니다.'));
    }
    callback(null, true);
  }
}).single('coverImg');

/* GET ALL Contents */
router.get('/', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    res.json(contents);
  });
});

/* SAVE Contents formData로 들어온 데이터 저장 + imageUrl스키마 필드에 파일 경로 저장*/
router.post('/', upload, (req, res, next) => {
  //이미지파일 압축
  if(req.file) {
    (async () => {
      const files = await imagemin([req.file.path], 'coverimg/', {
        plugins: [
          imageminMozjpeg({quality: 50}),
          imageminPngquant({
            quality: [0.6, 0.8]
          })
        ]
      });
      console.log(files);
    })();
  };
  let contents = new Contents({
    title: req.body.title,
    categories: req.body.categories.split(","),
    description: req.body.description,
    studyLocation: req.body.studyLocation,
    imageUrl: req.file ? req.file.path : basicImgPath,
    leader: {
      name: req.body.leader,
      email: req.body.email,
      profileImg: req.body.profileImg,
    },
  });
  contents.save((err, contents) => {
    if(err) return next(err);
    return res.json(contents);
  });
});

//스터디 내용 상세보기
router.get('/detail/:id', (req,res,next) => {
  Contents.findOneAndUpdate({ id: req.params.id },{ $inc: { views: 1 } }, (err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
});

//스터디 참여
router.put('/join/:id', (req, res, next) => {
  const participants = [{
    name: req.user.name,
    email: req.user.email,
    profileImg: req.user.image,
  }];
  Contents.findOneAndUpdate({ id: req.params.id }, { $push: { participants: participants } }, (err, contents) => {
    if (err) return next(err);
    res.json(contents);
  })
});

//스터디 탈퇴
router.put('/leave/:id', (req, res, next) => {
  Contents.findOneAndUpdate({ id: req.params.id }, { $pull: { participants: { email: req.user.email } } }, (err, contents) => {
    if (err) return next(err);
    res.json(contents);
  })
});

//스터디 삭제
router.delete('/delete/:id', (req, res, next) => {
  Contents.deleteOne({ id: req.params.id }, (err, contents) => {
    if (err) return next(err);
    res.json(contents);
  })
});

router.get('/representation1', (req, res, next) => { 
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  }).sort({views : -1})   
    .where('categories').in(['면접'])
    .limit(4);
});

//조회순 스터디
router.get('/views', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  .sort({views : -1})
  .limit(4);
});

router.get('/latest', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  .sort({id : -1})
  .limit(4);
});

router.get('/context/:id', (req, res, next) => { 
  Contents.find({categories : req.params.id},(err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  }); 
});

module.exports = router;