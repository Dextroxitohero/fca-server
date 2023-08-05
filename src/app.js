import express from 'express';
import bodyParser from "body-parser";
import morgan from 'morgan';
import pkg from '../package.json';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import usersRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import preRegisterRoutes from './routes/preRegister.routes';
// import statisticsRoutes from './routes/statitics.routes'
// import syncRoutes from './routes/sync.routes'

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

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
app.use(express.static('uploads')); 
app.use('/images', express.static('images'));


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

app.use('/users', usersRoutes)
app.use('/auth', authRoutes)
app.use('/preRegister', preRegisterRoutes)
// app.use('/statistics', statisticsRoutes)
// app.use('/sync', syncRoutes)


export default app