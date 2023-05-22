if (req.body.password != req.body.cnfimpwd) {
        return res.status(401).json({
                status: "Failed",
                message: "Password are not matched"
        });
} else {
        const passwordHash = await hashedPassword(req.body.password);
        const createUser = await User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                image: req.file.filename,
                password: passwordHash,
                is_Admin: 0
        });
        const savedUser = await createUser.save();
        if (savedUser) {
                sendVerifyMail(req.body.name, req.body.email, savedUser._id);
                return res.render(
                        'registration',
                        {
                                message: "Your regestration has been successfully, please verify the yor email."
                        });
        } else {
                return res.render(
                        'registration',
                        {
                                message: "Your regestration has been failed.."
                        });
        }
}