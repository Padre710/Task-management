const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const serverNo = process.env.no_server
const sequelize = require("./config/conf")
const comment = require('./model/comment')
const tag = require('./model/tag')
const task = require('./model/task')
const user = require("./model/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require("./router/router")

app.use(express.json())

app.get('/', (req,res) => {
res.status(200).json({message: "Server is running successfully"})
})



app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;


  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists.' });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({ username, email, password: hashedPassword, role: role || 'user' });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: 'Invalid email or password.' });
  
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });
  
      
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error.' });
    }
  });





app.listen(serverNo, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    console.log(`server is listening on http://localhost/${serverNo}`)
})
