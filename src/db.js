
import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

(async () => {
    try {
        const db = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Data base is coneccted to:', db.connection.name)
    } catch (error) {
        console.log('Something bad happend', error)
    }

})()