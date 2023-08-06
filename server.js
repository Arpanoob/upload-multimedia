const express = require('express');
const app = express();
const db = require('./models/db');
const userModel = require('./models/users')
const todoModel = require('./models/todo')

var session = require('express-session')
const fs = require('fs');
const multer = require('multer')
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url === '/signup')
      cb(null, "uploads/")
    if (req.url === '/todo')
      cb(null, "public/")
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


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

var d = [];
app.get('/signup', function (req, res) {
  //res.sendFile(__dirname+'/signup.html');
  res.render('signup', { error: null });
})
app.get('/styles.css', function (req, res) {
  res.sendFile(__dirname + '/styles.css');
})


app.post('/todo', function (req, res) {
  console.log("dddddddddddddddddddddddddddd")
  if (req.session.flag === false || req.session.flag === undefined) {
    res.status(201).end("unauten"); return;
  }

  if (req.session.flag == false) {
    res.sendFile(__dirname + "/login.html");
  }
  let file = req.file;
  console.log(file.filename)
  let todo = { text: req.body.text, pri: req.body.pri, todopic: file.filename, status: false };
  console.log(todo);
  todoModel.create(todo)
    .then(function () { console.log("done") }).catch(function (err) {
      console.log(err);
    })


  todoModel.find({})
    .then(function (users) {
      // 'users' will contain an array of all documents from the 'users' collection
      console.log(users);
      res.status(200).json(users);
      // Handle the retrieved data here
    })
    .catch(function (error) {
      console.error('Error retrieving users:', error);
      // Handle error
    });

  // fs.readFile('todo.txt', 'utf-8', function (err, data) {
  //   let dataArray=[];
  //   if (err) {
  //     console.error('Error ', err);
  //     dataArray = [];
  //   } else {
  //     if (data.length === 0) {
  //       dataArray = [];
  //     } else {
  //       dataArray = JSON.parse(data);
  //     }
  //   }

  //   try {
  //    // console.log("ff"+req.body);

  //     let file=req.file;
  //     let body=req.body;
  //     body["todopic"]=file.filename;
  //     body["status"]=false;
  //       console.log(file.filename+"fffffff"+req.file);
  //     dataArray.push(req.body);
  //     console.log(dataArray);
  //     fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
  //       if (writeErr) {
  //         console.error('Error writing to file:', writeErr);
  //         res.status(500).end('error');
  //       } else {
  //         console.log(' updated successfully!');
  //         res.status(200).json(dataArray);
  //       }
  //     });
  //   } catch (e) {
  //     console.error('Error:', e);
  //     res.status(500).end('error');
  //   }
  // });
});


app.delete('/todo', function (req, res) {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.status(401).end("unauten");
    return;
  }

  const name = req.body.text;
  const body = req.body;

  todoModel.deleteOne({ text: name })
    .then(function () {
      console.log('User deleted successfully');
      // Handle success or redirect to the appropriate page
    })
    .catch(function (error) {
      console.error('Error deleting user:', error);
      // Handle error
    });

  todoModel.find({})
    .then(function (users) {
      // 'users' will contain an array of all documents from the 'users' collection
      console.log(users);
      res.status(200).json(users);
      // Handle the retrieved data here
    })
    .catch(function (error) {
      console.error('Error retrieving users:', error);
      // Handle error
    });


  // fs.readFile('todo.txt', 'utf-8', function (err, data) {
  //   if (err) {
  //     console.error('Error reading file:', err);
  //     res.status(500).end('error');
  //     return;
  //   }

  //   let dataArray = [];
  //   if (data.length > 0) {
  //     dataArray = JSON.parse(data);
  //   }

  //                    // find the index of the object with the name
  //   const indexToRemove = dataArray.findIndex((item) => item.text === name);
  //   fs.unlink(__dirname+"/public/"+body.todopic, (err) => {
  //     if (err) {
  //       console.error('Error removing image:', err);
  //       // Handle the error if necessary
  //     } else {
  //       console.log('Image removed successfully!');
  //     }
  //   });
  //   if (indexToRemove !== -1) {
  //     // If the object is found, hatao from the rray
  //     dataArray.splice(indexToRemove, 1);

  //     // Write the updated array back to the file as JSON
  //     fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
  //       if (writeErr) {
  //         console.error('Error writing to file:', writeErr);
  //         res.status(500).end('error');
  //       } else {
  //         console.log('File content updated successfully!');
  //         res.status(200).json(dataArray);
  //       }
  //     });
  //   } else {
  //     //  object is not found error response
  //     res.status(404).end('Object no found');
  //   }
  // });
});
app.post('/signup', function (req, res) {
  let profilePic = req.file;
  console.log("FFFF" + req.url);

  console.log(profilePic.originalname + "," + req.body.password + " , " +
    req.body.confirmpassword + "," + profilePic);

  const user1 = {
    userName: req.body.username, password: req.body.confirmpassword,
    email: req.body.email, profilePic: profilePic
  };

  if (req.body.password !== req.body.confirmpassword) {
    res.render('signup', { error: "Password did not matched" + req.body.password + " . " + req.body.confirmpassword });
    return;
  }


  userModel.findOne({ userName: req.body.username, email: req.body.email })
    .then(function (user) {
      if (user) {
        res.render('signup', { error: "username already exist" });
        return;
      }
      userModel.create(user1).then(function () {
        console.log("Registered")
        res.render('login', { error: "updated successfully!" });;
      })
        .catch(function (err) {
          console.error(err)
          res.render('signup', { err: err })
        })

    })




  // fs.readFile('users.json',function(err,data){
  //   let dataArray=[];
  //   if (err) {
  //     console.error('Error ', err);
  //     dataArray = [];
  //   } else {
  //     if (data.length === 0) {
  //       dataArray = [];
  //     } else {
  //       dataArray = JSON.parse(data);
  //     }
  //   }
  //   try {
  // let flag=false;
  //     dataArray.forEach(function(user) {
  //       if(req.body.username===user.username||user.email===req.body.email)
  //       {
  //          flag=true;
  //       }
  //     });
  //     console.log("LLLLLLLLLLLLL")
  //     if(flag)
  //    { 
  //     console.log("LLLLLLLLLLLLL")
  //     //res.status(401).end('email present');
  //     res.render('signup',{error:"email or username already exist"});
  //     return;
  //   }
  //    let body=req.body;
  //    body['profilePic']=profilePic;
  //     dataArray.push(body);
  //     fs.writeFile('users.json', JSON.stringify(dataArray), function (writeErr) {
  //       if (writeErr) {
  //         console.error('Error writing to file:', writeErr);
  //        // res.status(500).end('error');
  //        res.render('signup',{error:"error"});

  //       } else {
  //         console.log(' updated successfully!');
  //        // res.status(200).json(dataArray);

  //        res.render('signup',{error:"updated successfully!"});
  //       }
  //     });
  //   } catch (e) {
  //     console.error('Error:', e);
  //     //res.status(500).end('error');
  //     res.render('signup',{error:"error"});

  //   }

  //});
});

app.get('/login', function (req, res) {
  // res.sendFile(__dirname+"/login.html");
  res.render("login", { error: null });

})
app.post('/login', function (req, res) {

  let username = req.body.username;
  let password = req.body.password;
  req.session.username = username;
  console.log(username, password);

  userModel.findOne({ userName: req.body.username, password: req.body.password })
    .then(function (user) {
      if (user) {
        req.session.flag = true;
        req.session.pic = user.profilePic.filename
        res.redirect('/');
      }
      else {
        res.render("login", { error: "INCORRECT" });
      }
    }).catch(function (error) {
      // Handle any potential errors from the findOne operation
      console.error('Error finding user:', error);
      res.render("login", { error: "An error occurred" });

    })





  // fs.readFile('users.json',function(err,data){
  // let flag=false;
  // let S=false;
  //   let dataArray=[];
  //   if (err) {
  //     console.error('Error ', err);
  //     dataArray = [];
  //     return;
  //   } 

  //     if (data.length === 0) {
  //       dataArray = [];
  //       //res.status(501).end('signup');
  //       res.render('login',{error:"signup"});
  //       return;
  //     }

  //       dataArray = JSON.parse(data);

  //       dataArray.forEach(function(user) 
  //       {
  //         if(user.username===username&&user.confirmpassword===password&&flag==false)
  //         {
  //           req.session.flag=true;
  //           console.log("ff");
  //            flag=true;
  //            req.session.pic=user.profilePic.filename;
  //            console.log("a",req.session.pic);
  //            res.redirect('/'); 
  //            return;
  //                 // res.status(200).end('incorrect sucess');;
  //         }
  //       });

  //       if(flag==false){
  //       dataArray.forEach(function(user) {

  //         if(user.username===username&&S==false)
  //         {
  //           console.log("errrrr");
  //         S=true;
  //         res.render("login",{error:"INCORRECT PASS"});
  //           return;//res.status(502).end('incorrect password');
  //         }

  //     });}

  //     if(S==false&&flag==false)
  //     {
  //       res.render("login",{error:"Sign-Up"});     
  //     }


  //   }
  // )})
  //app.use(express.static(path.join(__dirname, 'public')));
})

db.init().then(() => {
  console.log("DB CONNECTED");
  app.listen(3000, () => { console.log("listening to port 3000"); });
}).catch((err) => {
  console.error(err);
});







app.get('/', (req, res) => {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.redirect("/login"); return;
  }
  res.render("index", { profilePic: req.session.pic, username: req.session.username });
});
app.get('/home', (req, res) => {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.redirect("/login"); return;
  } res.render("index", { profilePic: req.session.pic, username: req.session.username });
});
app.get('/contact', function (req, res) {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.redirect("/login"); return;
  }
  res.render("contact", { profilePic: req.session.pic, username: req.session.username });
});
app.get('/about', (req, res) => {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.redirect("/login"); return;
  }
  res.render("about", { profilePic: req.session.pic, username: req.session.username });
})
app.get('/todo', (req, res) => {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.redirect("/login"); return;
  }

  res.render("todo", { profilePic: req.session.pic, username: req.session.username });
})


app.get('/todo.txt', function (req, res) {
  res.sendFile(__dirname + "/todo.txt")
})


app.get('/signup.js', function (req, res) {
  res.sendFile(__dirname + "/signup.js")
})

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Redirect the user to the home page or any other page after logout
    res.redirect('/login');
  });
})




app.put('/todo', function (req, res) {
  if (req.session.flag === false || req.session.flag === undefined) {
    res.status(401).end("unauten");
    return;
  }

  const name = req.body.text;
  console.log(name);
  const body = req.body;

  todoModel.findOneAndUpdate(
    { text: name }, // Replace with the document's unique identifier
    { status: true },
    { new: true } // Set to true to return the updated document in the result
  )
    .then(function (updatedUser) {
      // 'updatedUser' will contain the updated document
      console.log("LL" + updatedUser);
      // Handle the updated document here
    })
    .catch(function (error) {
      console.error('Error updating user:', error);
      // Handle error
    });

  //   fs.readFile('todo.txt', 'utf-8', function (err, data) {
  //     if (err) {
  //       console.error('Error reading file:', err);
  //       res.status(500).end('error');
  //       return;
  //     }

  //     let dataArray = [];
  //     if (data.length > 0) {
  //       dataArray = JSON.parse(data);
  //     }

  //                      // find the index of the object with the name
  //     const indexToEdit = dataArray.findIndex((item) => item.text === name);

  //     if (indexToEdit !== -1) {
  //       // If the object is found, hatao from the rray
  //     //  dataArray.splice(indexToRemove, 1);
  // dataArray[indexToEdit].status=true;
  //       // Write the updated array back to the file as JSON
  //       fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
  //         if (writeErr) {
  //           console.error('Error writing to file:', writeErr);
  //           res.status(500).end('error');
  //         } else {
  //           console.log('File content updated successfully!');
  //           res.status(200).json(dataArray);
  //         }
  //       });
  //     } else {
  //       //  object is not found error response
  //       res.status(404).end('Object no found');
  //     }
  //   });
});


app.get('/todoo', (req, res) => {

  todoModel.find({})
    .then(function (users) {
      // 'users' will contain an array of all documents from the 'users' collection
      console.log(users);
      res.status(200).json(users);
      // Handle the retrieved data here
    })
    .catch(function (error) {
      console.error('Error retrieving users:', error);
      // Handle error
    });


  // fs.readFile('todo.txt', 'utf-8', function (err, data) {
  //   if (err) {
  //     console.error('Error reading file:', err);
  //     res.status(500).end('error');
  //     return;
  //   }

  //   let dataArray = [];
  //   if (data.length > 0) {
  //     dataArray = JSON.parse(data);
  //   }
  //   res.status(200).json(dataArray);
  // });
});
