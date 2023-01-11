//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Server } = require("http");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/usersDB", {useNewUrlParser: true});
//mongo "mongodb+srv://cluster0.7fp58pn.mongodb.net/myFirstDatabase" --username Admin-Samuel
let  fName, lName, email, Password, confirmPassword;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  Password: String,
  confirmPassword: String
});

const userModel = new mongoose.model("userv2", userSchema);

app.get("/", function(req, res){
  res.render("sign-up");
});

app.post("/", function(req, res){
  let userDetails;
  const fName = req.body.fName
  const lName = req.body.lName
  const email = req.body.email
  const Password = req.body.createPassword
  const confirmPassword = req.body.confirmPassword
//Note that we are defining this model inside our post
  userDetails = new userModel({
  firstName: fName,
  lastName: lName,
  email: email,
  Password: Password,
  confirmPassword: confirmPassword
})
if(Password !==confirmPassword){
  //alert("password did not match! Make sure the field password matches.");
  console.log("Your password did not match!. Make sure the password fields matches.")
  res.redirect("/");
  }

else{
 const newUser = [userDetails];

userModel.find({}, function(err, theEmails){ //Note that, the find() method returns an array of objects, this method
  //in two parameters, as shown above, The 2nd one which is a callback also must take 2 params where 1st one is for
  //err handling while the second is a variable that we give as a name of the array returned by the find() metho. We can
  //call any array aperations, eg .length, on this name we give to the returned array.
  if(err){
    console.log(err)
  }
  else{
      const takenEmails = [];
       theEmails.forEach(myfuntion1);
       function myfuntion1(allEmails){//The ellements of the array returned by the find() method obove are js object, which
        //again has no name, as viewed from the database. For this case, we crete a variable that we will use to tap into
        //its property, in our case here we have created 'allEmails'
        takenEmails.push(allEmails.email);
       }
       const emailIsTaken= takenEmails.includes(newUser[0].email);
       if(emailIsTaken != false){
        // alert("the email address you specified is already taken. Try another email")
        console.log("The email you specified is already taken!. Try another one")
        res.redirect("/")
       }
       else {
         userModel.insertMany(newUser, function(err){
        if(err){
         console.log(err);
         }
        else{
    // console.log("Added one item in the database")
          console.log(newUser[0].lastName)
          }
  userDetails.save();
  res.redirect("/homepage");
})
 }
  }
});
}})

// alert("Thanks for signing up with us. Next time you visit the site, use your password to log in");


app.get("/homepage", function(req, res){
  res.render("homepage");
})

app.get("/homepage/users", function(req, res){

userModel.find({}, function(err, userv2Data){
  if(err){
    console.log(err)
  }
  else{
     res.render("userslist", {fieldsDataArray: userv2Data} )
  }
})
 })

// app.post("/homepage/users", function(req, res){
//   userModel.find({}, function(err, userv2){
//     if(err){
//       console.log(err)
//     }
//     else{
//       let userData = userv2.forEach(myfunction4);
//       function myfunction4(credentials){
//         firstNameIs = credentials.fName
//         lastNameIs = credentials.lName
//         emailIs = credentials.email
//         return firstNameIs, lastNameIs, emailIs
//       }
//       console.log(userData)
//     }
//   })
//   res.redirect("/hasAccount");
// })


app.get("/hasAccount", function(req,res){
  res.render("sign-in");
})

app.post("/hasAccount", function(req,res){
  res.render("sign-in", {});

})

app.post("/homepage/users", function(req, res){

userModel.find({}, function(err, userv2Data){
  if(err){
    console.log(err)
  }
  else{
     res.render("userslist", {fieldsDataArray: userv2Data} )
  }
})
  // res.render("sign-in")
 })

 app.post("/dont-have-account", function(req, res){
  res.render("sign-up");
 })

 app.get("/sign-in", function(req, res){
  res.render("sign-in")
 })

app.post("/sign-in", function(req, res){
  
userModel.find({}, function(err, details){
  if(err){
    console.log(err)
  }
  else{
    let eField = req.body.email
    let logInPassword = req.body.passwordField

    const existingEmails = [];
     details.forEach(myfuntion2);
    function myfuntion2(emails){
      existingEmails.push(emails.email);
    }
     console.log(existingEmails);

    const correspondinPasswords = [];
   details.forEach(myfuntion3);
   function myfuntion3(thePasswords){
    correspondinPasswords.push(thePasswords.Password);
   }
   console.log(correspondinPasswords);
  
    let existingEmailsLength = existingEmails.length
    let correspondinPasswordsLenth = correspondinPasswords.length


    //   function credentialConfirmation() {
    //    for(n=0; n<existingEmailsLength; n++ ){
    //    while(eField == existingEmails[n] && logInPassword == correspondinPasswords[n] ){
    //     //console.log("Wow! your email and passwords matched")
    //     // res.redirect("/homepage");
    //     return true;
    //    }
    //       }
    //    return false;
    //   // console.log("Password did not match!")
    //   }
    //  if(credentialConfirmation = true){
    //     console.log("Wow! your email and passwords matched")
    //     res.redirect("/homepage");
    //  }
    //   else {
    //   console.log("Account not found! Ether email or password is incorrect")
    //   res.redirect("/sign-in")
    //  }



   console.log(existingEmails.includes(eField))
   console.log(correspondinPasswords.includes(logInPassword))
   
    if(existingEmails.includes(eField) && correspondinPasswords.includes(logInPassword)){
      console.log("Email not was found!. We did not mind confirming if the password matche!")
      res.redirect("homepage");
    }
    else{
      console.log("Email and or password was not found in the database! Try again or create an acount.")
      res.redirect("/sign-in")
    }
     
}})
  //  res.redirect("/sign-in")
})

app.post("/delete", function(req, res){
let selectedItem = req.body.entry;
userModel.findByIdAndRemove(selectedItem, function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("Successfully deleted the specified item from the database")
    res.redirect("/homepage/users");
  }
})

})



const PORT = 3000;
app.listen(PORT, function(err) {
  if(err){
    confirm.log(err)
  }
  else{
  console.log("Server started on port " + PORT);
}
});
