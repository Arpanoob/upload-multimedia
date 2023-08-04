const express=require('express');
const app=express();
var session = require('express-session')
const fs=require('fs');
const multer  = require('multer')
app.use(express.static('uploads'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    console.log(name);
    cb(null, name)
  },
})

const upload = multer({ storage: storage })
app.use(upload.single('pic'));
app.use(express.json());

// app.js or server.js
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

var d=[];
app.get('/signup',function(req,res)
{
  //res.sendFile(__dirname+'/signup.html');
  res.render('signup',{error:null});
})
app.get('/styles.css',function(req,res){
   res.sendFile(__dirname+'/styles.css');
})


app.post('/todo', function (req, res) {
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.status(201).end("unauten");return;
  }
  
  if(req.session.flag==false)
  {
    res.sendFile(__dirname+"/login.html");
  }
  fs.readFile('todo.txt', 'utf-8', function (err, data) {
    let dataArray=[];
    if (err) {
      console.error('Error ', err);
      dataArray = [];
    } else {
      if (data.length === 0) {
        dataArray = [];
      } else {
        dataArray = JSON.parse(data);
      }
    }

    try {
      dataArray.push(req.body);
      fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
        if (writeErr) {
          console.error('Error writing to file:', writeErr);
          res.status(500).end('error');
        } else {
          console.log(' updated successfully!');
          res.status(200).json(dataArray);
        }
      });
    } catch (e) {
      console.error('Error:', e);
      res.status(500).end('error');
    }
  });
});


app.delete('/todo', function (req, res) {
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.status(401).end("unauten");
    return;
  }

  const name = req.body.text;

  fs.readFile('todo.txt', 'utf-8', function (err, data) {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).end('error');
      return;
    }

    let dataArray = [];
    if (data.length > 0) {
      dataArray = JSON.parse(data);
    }

                     // find the index of the object with the name
    const indexToRemove = dataArray.findIndex((item) => item.text === name);

    if (indexToRemove !== -1) {
      // If the object is found, hatao from the rray
      dataArray.splice(indexToRemove, 1);

      // Write the updated array back to the file as JSON
      fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
        if (writeErr) {
          console.error('Error writing to file:', writeErr);
          res.status(500).end('error');
        } else {
          console.log('File content updated successfully!');
          res.status(200).json(dataArray);
        }
      });
    } else {
      //  object is not found error response
      res.status(404).end('Object no found');
    }
  });
});
app.post('/signup',function(req,res){
  let profilePic=req.file;
  console.log("FFFF"+req.url);
  req.session.pic=profilePic.filename;
  console.log(profilePic.originalname+","+req.body.password+" , "+req.body.confirmpassword+","+profilePic);
  const user={profilePic:profilePic.filename};
  if(req.body.password!==req.body.confirmpassword)
  {
    res.render('signup',{error:"Password did not matched"+req.body.password+" . "+req.body.confirmpassword});
    return;
  }
fs.readFile('users.json',function(err,data){
  let dataArray=[];
  if (err) {
    console.error('Error ', err);
    dataArray = [];
  } else {
    if (data.length === 0) {
      dataArray = [];
    } else {
      dataArray = JSON.parse(data);
    }
  }
  try {
let flag=false;
    dataArray.forEach(function(user) {
      if(req.body.username===user.username||user.email===req.body.email)
      {
         flag=true;
      }
    });
    console.log("LLLLLLLLLLLLL")
    if(flag)
   { 
    console.log("LLLLLLLLLLLLL")
    //res.status(401).end('email present');
    res.render('signup',{error:"email or username already exist"});
    return;
  }
   let body=req.body;
   body['profilePic']=profilePic;
    dataArray.push(body);
    fs.writeFile('users.json', JSON.stringify(dataArray), function (writeErr) {
      if (writeErr) {
        console.error('Error writing to file:', writeErr);
       // res.status(500).end('error');
       res.render('signup',{error:"error"});

      } else {
        console.log(' updated successfully!');
       // res.status(200).json(dataArray);
      
       res.render('signup',{error:"updated successfully!"});
      }
    });
  } catch (e) {
    console.error('Error:', e);
    //res.status(500).end('error');
    res.render('signup',{error:"error"});

  }

});
});

app.get('/login',function(req,res){
 // res.sendFile(__dirname+"/login.html");
 res.render("login",{error:null});

})
app.post('/login',function(req,res){

let username=req.body.username;
let password=req.body.password;
req.session.username=username;
console.log("a",req.session.pic);
console.log(username,password);

fs.readFile('users.json',function(err,data){
let flag=false;
let S=false;
  let dataArray=[];
  if (err) {
    console.error('Error ', err);
    dataArray = [];
    return;
  } 

    if (data.length === 0) {
      dataArray = [];
      //res.status(501).end('signup');
      res.render('login',{error:"signup"});
      return;
    }

      dataArray = JSON.parse(data);

      dataArray.forEach(function(user) 
      {
        if(user.username===username&&user.confirmpassword===password&&flag==false)
        {
          req.session.flag=true;
          console.log("ff");
           flag=true;
           req.session.pic=user.profilePic.filename;
           console.log("a",req.session.pic);
           res.redirect('/'); 
           return;
                // res.status(200).end('incorrect sucess');;
        }
      });
      
      if(flag==false){
      dataArray.forEach(function(user) {

        if(user.username===username&&S==false)
        {
          console.log("errrrr");
        S=true;
        res.render("login",{error:"INCORRECT PASS"});
          return;//res.status(502).end('incorrect password');
        }

    });}

    if(S==false&&flag==false)
    {
      res.render("login",{error:"Sign-Up"});     
    }
    
  
  }
)})
//app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000,()=>{console.log("listening to port 3000");});
app.get('/',(req,res)=>{ 
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.redirect("/login");return;
  }
  res.render("index",{profilePic:req.session.pic,username:req.session.username});});
app.get('/home',(req,res)=>{ 
  if(req.session.flag===false|| req.session.flag === undefined)
   { res.redirect("/login");return;
  }res.render("index",{profilePic:req.session.pic,username:req.session.username});});
app.get('/contact', function(req, res) {
  if(req.session.flag===false|| req.session.flag === undefined)
  
  {
    res.redirect("/login");return;
  }
    res.render("contact",{profilePic:req.session.pic,username:req.session.username});
  });
app.get('/about',(req,res)=>{
  if(req.session.flag===false||req.session.flag === undefined)
  { 
    res.redirect("/login");return;
  }
    res.render("about",{profilePic:req.session.pic,username:req.session.username});
})
app.get('/todo',(req,res)=>{
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.redirect("/login");return;
  }
  res.render("todo",{profilePic:req.session.pic,username:req.session.username});
})


app.get('/todo.txt',function(req,res){
  res.sendFile(__dirname+"/todo.txt")
})


app.get('/signup.js',function(req,res){
  res.sendFile(__dirname+"/signup.js")
})

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Redirect the user to the home page or any other page after logout
    res.redirect('/login');
  });
})