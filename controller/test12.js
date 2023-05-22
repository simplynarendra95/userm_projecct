 // try {
    //     const userdata = await User.findOne({ email: req.body.email });
    //     if (userdata) {
    //         const matchedPWd = await comparePassword(req.body.password, userdata.password);
    //         if (matchedPWd) {
    //             if (userdata.is_Verified === '0') {
    //                 res.writeHead(401);
    //                 // res.statusCode = 404;
    //                 res.setHeader('Content-Type', 'text/plain');
    //                 // res.end('Cannot ' + req.method + ' ' + req.url);
    //                 return res.render("login", {
    //                     message: "Please verify your mail"
    //                 });
    //             } else {
    //                 res.writeHead(200);
    //                 // res.statusCode = 200;
    //                 res.setHeader('Content-Type', 'text/plain');
    //                 return res.redirect('home');
    //             }
    //         } else {
    //             // res.statusCode = 404;
    //             res.setHeader('Content-Type', 'text/plain');
    //             // res.end('Cannot ' + req.method + ' ' + req.url);
    //             res.writeHead(401);
    //             return res.render('login', {
    //                 message: "Email and Password are Incorrect.."
    //             });
    //         }
    //     } else {
    //         res.writeHead(401);
    //         // res.statusCode = 404;
    //         res.setHeader('Content-Type', 'text/plain');
    //         return res.render('login', {
    //             message: "Email and Password are Incorrect.."
    //         });
    //     }
    // } catch (error) {
    //     res.statusCode = 404;
    //     res.setHeader('Content-Type', 'application/json');
    //     console.log(error.message);

    // }


    // try {
    //     const userdata = await User.findOne({ email: req.body.email });
    //     // console.log("object userdata", typeof userdata.is_Verified);
    //     if (userdata) {
    //         // console.log("object userdata", userdata.password, "110");
    //         const matchedPWd = await comparePassword(req.body.password, userdata.password);
    //         // console.log("typeof", typeof comparePWd);
    //         if (matchedPWd) {
    //             // if (userdata.is_Verified === '0') {
    //             if (userdata.is_Verified === 0) {
    //                 return res.render("login", {
    //                     message: "Please verify the your email"
    //                 });
    //             } else {
    //                 req.session.userID = userdata._id;
    //                 return res.redirect("home")
    //             }
    //         } else {
    //             return res.render("login", {
    //                 message: "Email OR Password are inccorrect"
    //             });
    //         }
    //     } else {
    //         return res.render("login", {
    //             message: "Email OR Password are inccorrect"
    //         });
    //     }
    // } catch (error) {
    //     console.log("verifyLogin error", error.message);
    // }