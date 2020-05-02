// import modules
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

// import DB initializer
import connectDB from '../config/db.js';

// import middleware
import errorHandler from './middleware/errorMiddleware.js';

// import router files
import internships from './routes/internshipsRouter.js';
import companies from './routes/companiesRouter.js';
import auths from './routes/authenticationRouter.js';

// connect to database
connectDB();

const app = express();

// set logging middleware using the morgan logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount cookie parser
app.use(cookieParser());

// attach body parser
app.use(express.json());

// mount file upload middleware
app.use(fileUpload());


// set static public folder
app.use(express.static(path.join(process.cwd(), 'public')));

// mount routers
app.use('/api/v1/companies', companies);
app.use('/api/v1/internships', internships);
app.use('/api/v1/auth', auths);

// mount error handler middleware
app.use(errorHandler);

// set port
const PORT = process.env.PORT || 5000;

// start listening on 'PORT'
const server = app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

// Handle all unhandeled rejections 
process.on('unhandledRejection', (err, promis) => {
  console.log(`Error: ${err.message}`);

  // close and exit server
  server.close(() => process.exit(1))
});