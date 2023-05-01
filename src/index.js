import app from './app';
import './db'
import { PORT } from './config';

app.listen(PORT)

console.log('Server on port', PORT)