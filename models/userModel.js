const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Người dùng phải có tên'],
    },
    email: {
        type: String,
        required: [true, 'Người dùng cần nhập email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email không hợp lệ'],
    },
    photo: {
        type: String,
        default:
            'https://res-console.cloudinary.com/dxzrtwxdj/media_explorer_thumbnails/4520d2173a9e4f911f4c1dc4db3408cd/detailed',
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'editor', 'admin'],
    },
    password: {
        type: String,
        required: [true, 'Người dùng cần nhập mật khẩu'],
        minlength: [8],
        select: false,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpries: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

// before create and save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (
    candicatePassword,
    userPassword,
) {
    return await bcrypt.compare(candicatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
    if (this.passwordChangeAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10,
        );
        return changedTimeStamp > JWTTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpries = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
