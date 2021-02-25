const express = require('express');
const app = express();
const { auth } = require('./middleware/auth')
const cookieParser  = require('cookie-parser');
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const { Video } = require("./models/Video"); 
const { Subscriber } = require("./models/Subscriber");
const config = require('./config/key');
const port = 5000;
const multer = require('multer');// video파일저장
const ffmpeg = require('fluent-ffmpeg');// 썸네일 생성

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());
// 서버에있는 static한파일처리
app.use('/uploads', express.static('uploads'));

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true, 
    useFindAndModify: false
})
.then( ()=> console.log('MongDB Connected...'))
.catch( err => console.log(err));

//동영상 파일을 저장하기 위한 multer 옵션!
let storage = multer.diskStorage({
  //파일을 올리면 uploads 폴더에 저장됨
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos');
  },
  //파일을 이름 저장
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  //파일 종류 제한
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  }
});

const upload = multer({ storage: storage }).single('file');

app.get('/', (req, res) => {
    res.send("안녕하세요~~!!새해복많이")
})

app.post('/api/users/register', (req,res) => {
    // 회원가입할 떄 입력한 정보들을 Client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

  // console.log('ping')
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {

    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth , (req, res) => {

// 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말.

  res.status(200).json({
    _id: req.user._id,
    idAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})

app.get('/api/users/logout', auth , (req,res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: ""} 
    ,(err,user) => {
      if(err) return res.json({ success: false , err});
      return res.status(200).send({
        success: true
      }) 
    })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 


//video
app.post('/api/video/uploadfiles',(req, res) => {
  upload(req, res, err => {
    if(err) return res.json({ success: false, err});
    //url은 uploads 폴더에 저장된 경로를 client에 보내줌
    return res.json({ 
      success: true, 
      url: res.req.file.path, 
      fileName: res.req.file.filename
    });
  });
});

app.post('/api/video/thumbnail', (req, res) => {

  let thumbsFilePath = "";
  let fileDuration = "";

   // 비디오 전체 정보 추출
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  //썸네일 생성, 비디오 길이 추출
  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 1,
      folder: "uploads/thumbnails",
      size: "320x200",
      // 기본이름 입력
      filename: "thumbnail-%b.png",
    });
});

app.post('/api/video/uploadVideo', (req, res) => {
  //영상 저장
  const video = new Video(req.body)
  video.save((err, doc) => {
    if(err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true });
  });
});


app.get('/api/video/getVideos', (req, res) => {
  //DB에서 영상가져와 클라에보낸다
  Video.find().populate('writer').exec((err, videos) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, videos})
  })
});

app.post('/api/video/getVideoDetail', (req, res) => {
  Video.findOne({'_id': req.body.videoId})
    .populate('writer').exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail })
    })
});

// // 비디오페이지분류 이유 : 비디오페이지에서 구독정보 가져온다
// app.post('/api/video/getSubscriptionVideos', (req, res) => {
//   //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
//   Subscriber.find({ 'userFrom' : req.body.userFrom })
//     .exec((err, subscriberInfo) => {
//       if (err) return res.status(400).send(err);

//       let subscribedUser = [];

//       subscriberInfo.map((subscriber, i) => {
//         subscribedUser.push(subscriber.userTo);
//       })

//   //찾은 사람들의 비디오를 가지고온다.
//       Video.find({ writer: { $in: subscribedUser }})
//         .populate('writer')
//         .exec((err, videos) => {
//           if (err) return res.status(400).send(err);
//           return res.status(200).json({ success: true, videos})
//         })
//     })
// });

//subscribe
app.post('/api/subscribe/subscribeNumber', (req, res) => {
  Subscriber.find({ 'userTo': req.body.userTo })
  .exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
  })
});

app.post('/api/subscribe/subscribed', (req, res) => {
  Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
  .exec((err, subscribe) => {
    if (err) return res.status(400).send(err);

    let result = false
    if (subscribe.length !== 0) {
      result = true
    }
    return res.status(200).json({ success: true, subscribed: result })
  })
});

app.post('/api/subscribe/subscribe', (req, res) => {
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err});
    return res.status(200).json({ success: true });
  })
});

app.post('/api/subscribe/unSubscribe', (req, res) => {
  Subscriber.findOneAndDelete({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
  .exec((err, doc) => {
    if (err) return res.json({ success: false, err});
    return res.status(200).json({ success: true, doc });
  })
});

