const express = require('express');
const app = express();
// const { auth } = require('./middleware/auth')
const cookieParser  = require('cookie-parser');
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const config = require('./config/key');


// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then( ()=> console.log('MongDB Connected...'))
  .catch( err => console.log(err));

const port = 5000;

app.get('/', (req, res) => {
    res.send("안녕하세요~~!!새해복많이")
})

app.post('/register', (req,res) => {
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

app.post("/login", (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
  
      if (!user) {
  
        return res.json({
  
          loginSuccess: false,
  
          message: "없는 아이디입니다.",
  
        });
  
      }
  
      user.comparePassword(req.body.password, (err, isMatch) => {
  
        if (!isMatch) {
  
          return res.json({
  
            loginSuccess: false,
  
            message: "비밀번호가 틀렸습니다.",
  
          });
  
        }
  
        user.generateToken((err, user) => {
  
          if (err) return res.status(400).send(err);
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
  
        });
  
      });
  
    });
  
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 