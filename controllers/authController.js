const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const AppError = require('../helpers/appError');
const authService = require('../services/authService');
const userService = require('../services/userService');

exports.signup = catchAsync(async (req, res, next) => {
    const { email, name, password } = req.body;
    const newUser = await authService.signup({
        email,
        name,
        password,
    });
    authService.login(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400));
    }

    const user = await userService.getUserWithPassWord({ email });

    const correct =
        !!user && (await user.correctPassword(password, user.password));

    if (!correct) {
        return next(new AppError('Incorrect email or password.', 401));
    }

    authService.login(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    console.log(
        '🚀 ~ file: authController.js:72 ~ exports.forgotPassword=catchAsync ~ req.email:',
        req.body.email,
    );
    const user = await userService.getUser({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email.', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.FE_REACT_URL}/auth/reset-password/${resetToken}`;

    // const resetURL = `${req.protocol}://${req.get(
    //     'host',
    // )}/api/users/reset-password/${resetToken}`;
    // const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${resetURL}.\nIf you didn't  forget your password, please ignore this email.`;

    try {
        await new Email(user, url).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Đường dẫn đặt lại mật khẩu đã được gửi đến bạn.',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpries = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'There was an error sending the email. Please try again later.',
                500,
            ),
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await userService.getUser({
        passwordResetToken: hashedToken,
        passwordResetExpries: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Token đã hết hạn.', 400));
    }

    user.password = req.body.password;
    // user.passwordChangeAt = Date.now();
    user.passwordResetExpries = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    authService.login(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    if (!req.body.password || !req.body.newPassword) {
        return next(new AppError('Invalid.', 404));
    }

    if (req.body.password === req.body.newPassword) {
        return next(new AppError('New and old passwords are the same.', 401));
    }

    const user = await userService.getUserByIdWithPassWord(req.user.id);

    if (!user) {
        return next(new AppError('No user found with that ID.', 404));
    }

    const correct = await user.correctPassword(
        req.body.password,
        user.password,
    );

    if (!correct) {
        return next(new AppError('Incorrect password.', 401));
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    authService.createSendToken(user, 200, res);
});
