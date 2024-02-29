import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { logger } from './middlewares/logEvents'
import cron from 'node-cron';

import { updateOpenCoursesStatus } from './tasks/updateStartCourse.tasks';

import usersRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import preRegisterRoutes from './routes/preRegister.routes';
import optionsRoutes from './routes/options.routes';
import languageRoutes from './routes/language.routes';
import levelRoutes from './routes/level.routes';
import colorRoutes from './routes/color.routes';
import courseRoutes from './routes/course.routes';
import accountsNumberRoutes from './routes/accountsNumber.routes';
import refreshTokenRoutes from './routes/refreshToken.routes';
import headerImageRoutes from './routes/headerImage.routes';
import chatRoutes from './routes/chat.routes';

import { BASE_URL_DEV, BASE_URL_PRODUCTION } from './config';
import { updateEndCoursesStatus } from './tasks/updateEndCourse.task';


const app = express()


// custom middleware logger
app.use(logger);

app.use(cors({ credentials: true, origin: BASE_URL_DEV }));
// app.use(cors({credentials: true, origin: BASE_URL_PRODUCTION }));

app.use(express.json({
	limit: "50mb",
	extended: false
}))

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(morgan('dev'))

app.set('pkg', pkg)

app.get('/', (req, res) => {
	res.json({
		name: app.get('pkg').name,
		author: app.get('pkg').author,
		description: app.get('pkg').description,
		version: app.get('pkg').version
	})
})

// to serve images inside public folder
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/flags', express.static('uploads/flags'));


// Configure Header HTTP
app.use((req, res, next) => {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header(
	// 	"Access-Control-Allow-Headers",
	// 	"x-access-token, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
	// );
	// res.header("Access-Control-Allow-Credentials", true);
	res.setHeader('Content-Type', 'multipart/form-data');
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.header("Allow", "GET, POST");
	next();
});

cron.schedule('0 0 * * *', async () => {
	try {
		await updateOpenCoursesStatus();
		await updateEndCoursesStatus();
	} catch (error) {
		console.error('Error al actualizar cursos:', error);
	}
}, {
	timezone: 'America/Mexico_City',
});

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/preRegister', preRegisterRoutes);
app.use('/options', optionsRoutes);
app.use('/language', languageRoutes);
app.use('/level', levelRoutes);
app.use('/color', colorRoutes);
app.use('/course', courseRoutes);
app.use('/accountNumber', accountsNumberRoutes);
app.use('/refresh-token', refreshTokenRoutes);
app.use('/headerImage', headerImageRoutes);
app.use('/chat', chatRoutes);

export default app;