import express from 'express';
import path from 'path';
import bodyParser from "body-parser";
import morgan from 'morgan';
import pkg from '../package.json';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import { logger } from './middlewares'
import { logger } from './middlewares/logEvents'

import usersRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import preRegisterRoutes from './routes/preRegister.routes';
import optionsRoutes from './routes/options.routes';
import languageRoutes from './routes/language.routes';
import levelRoutes from './routes/level.routes';
import colorRoutes from './routes/color.routes';
import courseRoutes from './routes/course.routes';
import refreshTokenRoutes from './routes/refreshToken.routes';
// import { credentials } from './middlewares/credentials';

const buildPath = path.join(__dirname, 'app/build');

console.log(buildPath)

const app = express()


// custom middleware logger
app.use(logger);

// app.use(credentials)
// app.use(cors({credentials: true, origin: 'https://control-escolar.cfamex.com'}));
app.use(cors({ credentials: true, origin: 'http://localhost:8000/login' }));

app.use(express.json({
	limit: "50mb",
	extended: false
}))

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(morgan('dev'))

app.set('pkg', pkg)

// app.get('/', (req, res) => {
// 	res.json({
// 		name: app.get('pkg').name,
// 		author: app.get('pkg').author,
// 		description: app.get('pkg').description,
// 		version: app.get('pkg').version
// 	})
// })

// to serve images inside public folder
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/flags', express.static('uploads/flags'));


app.use(express.static(buildPath))
app.get('*', (req, res) => {
	res.sendFile(path.join(buildPath, 'index.html'))
})

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

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/preRegister', preRegisterRoutes);
app.use('/options', optionsRoutes);
app.use('/language', languageRoutes);
app.use('/level', levelRoutes);
app.use('/color', colorRoutes);
app.use('/course', courseRoutes);
app.use('/refresh-token', refreshTokenRoutes);


export default app