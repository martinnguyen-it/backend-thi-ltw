const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name.split(' ')[user.name.split(' ').length - 1];
        this.url = url;
        this.from = `Quy DTN <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        // if (true) {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                host: process.env.SENDGRID_HOST,
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                name: this.name,
                url: this.url,
                subject,
            },
        );

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.fromString(html),
            html,
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Chào mừng đến với Tổ chức từ thiện DTN');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Đặt lại mật khẩu của bạn (chỉ có hiệu lực trong 10 phút)',
        );
    }
};
