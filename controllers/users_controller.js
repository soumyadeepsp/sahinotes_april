const User = require('../models/users');
const forgotPasswordMailer = require('../mailers/forgot_password_mailer');
// const queue = require('../workers/acount_created_mailer_worker');
const accountCreatedMailer = require('../mailers/account_created_mailer');
const Note = require('../models/notes');
const Comment = require('../models/comments');
const fs = require('fs');

module.exports.checkAuthentication = (req, res) => {
    console.log("inside check auth controller");
    console.log("logged in user = "+req.cookies.sahinotes);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        console.log("user is logged in");
        return res.json({success: true});
    } else {
        console.log("user is already logged out");
        return res.json({success: false});
    }
}

module.exports.profile = (req, res) => {
    console.log("logged in user = "+req.user);
    var logged_in_user = req.user._id;
    var profile_user_id = req.params.logged_is_user_id;
    if (req.isAuthenticated()) {
        return res.render('profile');
    } else {
        if (logged_in_user!=profile_user_id) {
            return res.render('profile');
        }
        return res.render('signin');
    }
}

module.exports.signup = (req, res) => {
    res.render('signup');
}

module.exports.signin = (req, res) => {
    res.render('signin');
}

module.exports.signinFailure = (req, res) => {
    req.flash('success', 'Signin is not successful');
    res.render('signin');
}

module.exports.forgot_password = (req, res) => {
    res.render('forgot_password');
}

module.exports.update_password = (req, res) => {
    res.render('update_password');
}

module.exports.invalidauth = (req, res) => {
    return res.json({sucess: false, message: "Passwords is incorrect!"});
}

module.exports.create = (req, res) => {
    console.log(req.body);
    var email = req.body.email
    if (email.substring(email.length-4, email.length)!='.com') {
        return res.status(401).json({sucess: false, message: "Email not valid"});
    }
    if (req.body.password != req.body.confirmPassword) {
        return res.status(401).json({sucess: false, message: "Passwords don't match"});
    }
    //search if this is a new user or an old one
    // if new user -> create user -> send to sign in page
    // if old user -> send to sign in page
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {console.log('Error in finding user in create controller: ', err);
            return res.status(201).json({sucess: false});
        }
        // if condition is true if user==null/undefined which means no prevous entry
        if (!user) {
            console.log("user getting created");
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }, function(err, user) {
                if (err) {console.log('Error in creating user in create controller: ', err);
                    return res.json({sucess: false});;
                }
                // send notification 
                req.flash('success', 'Signup is successful');
                // i should send the email(user.email)
                accountCreatedMailer.accountCreated(user);
                // call the worker here
                // queue.create('emails', user).save(function(err) {
                //     if (err) {console.log(err); return;}
                // });
                // i am not sending mails directly.. i am sending via workers
                // return res.redirect('/users/signin');
                console.log("user got created");
                return res.json({sucess: true});
            });
        } else {
            // return res.redirect('/users/signin');
            return res.json({sucess: false});
        }
    });
}
// notes and notelists schemas dont have any records till now

module.exports.createSession = async (req, res) => {
    // show notification
    var userId = req.user.id;
    req.flash('success', 'Login is successful');
    // return res.redirect(`/users/profile/${userId}`);
    const user = await User.findById(userId);
    console.log({id: userId, name:user.name});
    // var currentDate = new Date();
    // var expiryDate = currentDate.setHours(currentDate.getHours() + 24);
    // expiryDate = new Date(expiryDate);
    // var session = await Session.create({
    //     id: userId,
    //     expires: expiryDate
    // });
    // console.log(session);
    return res.json({success: true, user: {id: userId, name:user.name}});
}

module.exports.logout = (req, res) => {
    console.log("logged in user: "+req);
    if (req.isAuthenticated()) {
        req.logout(function(err) {
            if (err) {console.log('Error in logging out: ', err); return res.json({success: false});}
        });
        return res.json({success: true});
    } else {
        console.log("user is logged out");
        return res.json({success: false});
    }
}

module.exports.verifyMobile = (req, res) => {
    return res.render('verify_mobile');
}

module.exports.sendOtpMessage = (req, res) => {
    // send the otp message
    const mobilenumber = req.params.mobileNumber;
    const userEmail = req.user.email;
    API_KEY = "SVZdWQo2lMrjBcaughGY5Aey4CKtxqRiTnJ0m7IU6wvkDL8H3p3MvyUhaGzpqkRxrwY8iTQK649l7JOS"

    const fast2sms = require('fast-two-sms');
    const otp = Math.floor(Math.random()*9000) + 1000;

    var options = {
        authorization : API_KEY ,
        message : `Your OTP is ${otp}` , 
        numbers : [mobilenumber]
    }

    function removeOtp(myotp) {
        setTimeout(function() {
            User.findOne({email: userEmail}, function(err, user){
                if (err) {return;}
                if (user.mobileOtp==myotp) {
                    User.findOneAndUpdate({email: userEmail, mobileOtp: ""}, function(err, user) {});
                }
            });
        }, 30*1000);
    }

    async function sendOtpMessage() {
        var res = await fast2sms.sendMessage(options);
        if (res) {
            User.findOneAndUpdate({email: userEmail}, {mobileOtp: otp}, function(err, user) {
                if (err) {console.log('Error in saving otp: ', err); return;}
                user.save();
                removeOtp(otp);
            });
        } else {
            console.log('balance over');
        }
    }
    sendOtpMessage();
}

module.exports.verifyOtp = (req, res) => {
    var obj = JSON.parse(req.params.obj);
    var mobileNumber = obj.mobileNumber;
    var otp = obj.otp;
    const userEmail = req.user.email;
    if (otp==req.user.mobileOtp) {
        User.findOneAndUpdate({email: userEmail}, {mobile: mobileNumber, mobileOtp: ""}, function(err, user) {
            if (err) {console.log('Error in verifying otp: ', err); return;}
            user.save();
        });
    } else {
        User.findOneAndUpdate({email: userEmail}, {mobileOtp: ""}, function(err, user){});
        console.log("otp invalid");
    }
    console.log('mobile number verified');
    return;
}

module.exports.forgot_password_post = (req, res) => {
    var email = req.body.email;
    var token = Math.floor(Math.random()*9000) + 1000;
    var accessToken = email + token;
    User.findOneAndUpdate({email: email}, {accessToken: accessToken}, function(err, user) {
        if (err) {console.log('Error in finding user in forgot password post: ', err); return;}
        if (!user) {
            console.log('User not found');
        } else {
            user.save();
            var obj = {};
            obj.email = user.email;
            obj.url = `http://localhost:8000/users/update_password?accessToken=${accessToken}`
            forgotPasswordMailer.forgotPassword(obj);
        }
    })
}

module.exports.update_password_post = (req, res) => {
    //extract email id and accessToken
    //check if accessToken is present in the user with that email id
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var accessToken = req.body.accessToken;
    if (password!=confirm_password) {
        return res.redirect('back');
    } else {
        var email = accessToken.substring(0, accessToken.length-4);
        User.findOne({email: email}, function(err, user) {
            if (err) {console.log('Error in finding user: ', err); return;}
            if (accessToken==user.accessToken) {
                User.findOneAndUpdate({email: email}, {password: password, accessToken: null}, function(err, user) {
                    if (err) {console.log('Error in finding user: ', err); return;}
                    user.save();
                });
            }
        });
        return res.redirect('/users/signin');
    }
}

module.exports.uploadNotes = (req, res) => {
    var name = req.query.name;
    var about = req.query.about;
    var id = req.query.id;
    console.log(name, about, id);
    return;
    // if (req.files) {
    //     var filename = req.files.notes.name;
    //     var dotindex = filename.indexOf(".");
    //     filename = filename.substring(0, dotindex)+Date.now()+filename.substring(dotindex, filename.length);
    //     req.files.notes.mv(__dirname+"/../assets/uploads/notes/"+filename, function(err) {
    //         if (err) {console.log('Error in moving file in folder: ', err); return res.send(err);}
    //         Note.create({
    //             name: name,
    //             about: about,
    //             file: filename,
    //             user: id
    //         }, function(err, note) {
    //             if (err) {console.log('Error in saving note in DB: ', err); return res.send(err);}
    //             User.findById(id, function(err, user) {
    //                 if (err) {console.log('Error in finding user in upload notes: ', err); return res.send(err);}
    //                 user.notes.push(note.id);
    //                 user.save();
    //             })
    //         })
    //     })
    // }
    // return res.redirect(`/users/profile/${id}`);
}

module.exports.show_all_notes = (req, res) => {
    var id = req.params.profile_id;
    User.findById(id, async (err, user) => {
        if (err) {console.log('Error in finding user in show_all_notes: ', err); return;}
        var notesids = user.notes;
        var result = [];
        for (var i=0; i<notesids.length; i++) {
            try {
                var note = await Note.findById(notesids[i]);
                result.push(note);
            } catch(err) {
                console.log('Error in finding note: ', err);
            }
        }
        return res.status(200).json(result);
    });
}

module.exports.show_single_notes = async (req, res) => {
    console.log(req.params);
    var userId = "6404a2886e692a00ddef59c7";
    console.log("user id = ", userId);
    var user = await User.findById(userId);
    var name = req.params.file;
    var note = await Note.findOne({file: name});
    var file = note.file;
    var about = note.about;
    var id = note._id;
    if (!user.viewedNotes.includes(note._id)) {
        user.viewedNotes.push(note._id);
        note.views.push(userId);
        note.save();
        user.save();
    }
    return res.status(200).json({
        success: true,
        name: name,
        about: about,
        id: id,
        filename: file
    });
    // return res.render('notes', {
    //     name: name,
    //     about: about,
    //     id: id,
    //     filename: file
    // });
}

module.exports.likeNotes = (req, res) => {
    var userId = req.user.id;
    var noteName = req.params.noteName;
    User.findById(userId, async (err, user) => {
        if (err) {console.log('Error in finding user in likeNotes: ', err); return;}
        try {
            var note = await Note.findOne({file: noteName});
            if (!user.likedNotes.includes(note._id)) {
                user.likedNotes.push(note._id);
            }
            if (!note.likedUsers.includes(userId)) {
                note.likedUsers.push(userId);
            }
            note.save();
            user.save();
        } catch(err) {
            console.log('error in finding not in likeNotes: ', err);
        }
    });
}

module.exports.numberOfLikes = (req, res) => {
    var file = req.params.noteName;
    Note.findOne({file: file}, (err, note) => {
        if (err) {console.log(err); return;}
        return res.status(200).json({
            likes: note.likedUsers.length,
            views: note.views.length
        });
    })
}

module.exports.getComments = (req, res) => {
    //fetch all the comments for a note
    var id = req.params.noteName;
    Note.findById(id, async (err, note) => {
        if (err) {console.log("Error in finding note in getComments: ", err); return;}
        var comments_respone = {};
        var parent_comment_ids = note.comments;
        for (var i of parent_comment_ids) {
            var parent_comment = await Comment.findById(i);
            comments_respone[i] = {};
            comments_respone[i]["text"] = parent_comment.text;
            comments_respone[i]["child_comments"] = {};
            for (var j of parent_comment.comments) {
                var child_comment = await Comment.findById(j);
                comments_respone[i]["child_comments"][j] = child_comment.text;
            }
        }
        return res.status(200).json(comments_respone);
    });
}

module.exports.addNewComment = async (req, res) => {
    var file = req.body.file;
    var userId = req.user.id;
    var text = req.body.text;
    var note = await Note.findOne({file: file});
    var noteId = note._id;
    var type = req.body.type;
    var comment = req.body.comment;
    var new_comment = await Comment.create({
        text: text, note: noteId, user: userId, type: type, comment: comment, comments: []
    });
    User.findById(userId, async function(err, user) {
        if (err) {console.log("Error in finding user in addNewComment: ", err); return;}
        await user.comments.push(new_comment._id);
        await user.save();
    });
    if (type=="Notes") {
        Note.findById(noteId, async function(err, note) {
            if (err) {console.log('Error in finding note in addNewComment: ', err); return;}
            await note.comments.push(new_comment._id);
            await note.save();
        });
    }
    if (type=="Comments") {
        Comment.findById(new_comment.comment, async function(err, comment) {
            if (err) {console.log("Error in finding parent comment in addNewComment: ", err); return;}
            await comment.comments.push(new_comment._id);
            await comment.save();
        });
    }
}

module.exports.deleteNote = async (req, res) => {
    const file = req.params.note_file;
    var note = await Note.findOne({file: file});
    var author = await User.findById(note.user);
    var index = author.notes.indexOf(note._id);
    await author.notes.splice(index, 1);
    await author.save();
    var likedUsers = note.likedUsers;
    var viewedUsers = note.views;
    for (var i=0; i<likedUsers.length; i++) {
        var u = await User.findById(likedUsers[i]);
        var index = u.likedNotes.indexOf(note._id);
        await u.likedNotes.splice(index, 1);
        await u.save();
    }
    for (var i=0; i<viewedUsers.length; i++) {
        var u = await User.findById(viewedUsers[i]);
        var index = u.viewedNotes.indexOf(note._id);
        await u.viewedNotes.splice(index, 1);
        await u.save();
    }
    var parentComments = note.comments;
    for (var i=0; i<parentComments.length; i++) {
        var x = await Comment.findById(parentComments[i]);
        var childComments = x.comments;
        for (var j=0; j<childComments.length; j++) {
            var y = await Comment.findById(childComments[j]);
            var u = await User.findById(y.user);
            var index = u.comments.indexOf(y._id);
            await u.comments.splice(index, 1);
            await u.save();
            await Comment.findByIdAndDelete(y._id);
        }
        var u = await User.findById(x.user);
        var index = u.comments.indexOf(x._id);
        await u.comments.splice(index, 1);
        await u.save();
        await Comment.findByIdAndDelete(x._id);
    }
    await Note.findByIdAndDelete(note._id);
    fs.unlink(__dirname+`/../assets/uploads/notes/${file}`, function(err) {
        if(err) return console.log(err);
        console.log('file deleted successfully');
    });
}

module.exports.getAllUsers = async (req, res) => {
    if (req.isAuthenticated()) {
        var users = await User.find();
        var output = [];
        for (var i=0; i<users.length; i++) {
            output.push({id: users[i]._id, name: users[i].name});
        }
        return res.status(200).json(output);
    }
}