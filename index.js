const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000

// Parse options
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// routes
const blogRoutes = require("./src/routes/blog.route");
const commentRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route")
app.use("/api/auth", userRoutes)

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes)
///N

app.get('/api', (req, res) => {
  res.send('Welcome to the API! Available routes: /api/auth, /api/blogs, /api/comments');
})

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    
 
}

   app.get('/', (req, res) => {
  res.send('Hotels Rooftop Server is running......!')
})
///// N
if (!process.env.MONGODB_URL) {
  console.error("Missing MONGODB_URL in environment variables!");
  process.exit(1);
}

///// N
main().then(() => console.log("Mongodb connected sucessfully...")).catch((err) => console.log(err))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
