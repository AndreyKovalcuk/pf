const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
    origin: '*', // Разрешаем запросы с любого домена
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static('.')); // Раздаем статические файлы

// Настройка транспорта для отправки писем
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // true для 465 порта
    auth: {
        user: 'andreykovalcuk@yandex.ru',
        pass: 'ouxiiljznsxnqncb'
    }
});

// Обработка POST запроса с формы
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: 'andreykovalcuk@yandex.ru', // Должен совпадать с auth.user
        to: 'andreykovalcuk@yandex.ru',
        subject: `Новое сообщение от ${name}`,
        text: `
            Имя: ${name}
            Email: ${email}
            Сообщение: ${message}
        `,
        html: `
            <h3>Новое сообщение с сайта-портфолио</h3>
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Сообщение:</strong> ${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Письмо успешно отправлено');
        res.status(200).json({ message: 'Сообщение успешно отправлено' });
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        res.status(500).json({ error: 'Ошибка при отправке сообщения', details: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 