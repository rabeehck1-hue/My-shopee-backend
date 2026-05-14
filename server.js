import dotenv from"dotenv";
dotenv.config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// products API
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth")
const adminMiddleware = require("./middleware/admin")

app.post("/products", authMiddleware, adminMiddleware, async (req, res) => {

  try{
    console.log("BODY RECIVED:", req.body)
    
    const newProduct = await
    Product.create(req.body)
    console.log("SAVED PRODECT:", newProduct)
    
    res.json(newProduct)
    console.log(req.user.userId)
  }catch (err) {
    console.log("POST ERROR:", err.message)
    
    res.status(500).json({error: err.message})
  }
  });

app.get("/products", async (req, res) => {
 const products = await Product.find();
  res.json(products);
});  

app.delete("/products/:id", authMiddleware, async (req,res) => 
  {
  try{
    const deletedProduct = await
    Product.findByIdAndDelete(req.params.id)
    res.json(deletedProduct)
    console.log(req.user.userId)
  } catch (err){
    res.status(500).json({error: err.message}) 
   }
  })

app.put("/products/:id", async (req,res) => 
  {
  try{
    const updatedProduct = await
    Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {returnDocument : "after"}
    )
    res.json(updatedProduct)
  } catch (err){
    res.status(500).json({error: err.message}) 
   }
  })

  app.post("/orders", authMiddleware, async (req, res) => {

  try{
    console.log("BODY RECIVED:", req.body)
    
    const newOrder = await
    Order.create({
      userId: req.user.userId,
      items: req.body.items,
      total: req.body.total,
    })
    console.log("SAVED PRODECT:", newOrder)
    
    res.json(newOrder)
    console.log(req.user.userId)
  }catch (err) {
    console.log("POST ERROR:", err.message)
    
    res.status(500).json({error: err.message})
  }
  });

  app.get("/orders", authMiddleware, async (req, res) => {
 const orders = await Order.find({userId: req.user.userId});
  res.json(orders);
});  

const bcrypt = require ("bcrypt")


app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await
    bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })


    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const jwt = require("jsonwebtoken")


app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if(!isMatch){
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {userId: user._id,email: user.email, role: user.role},
      "mysecretkey",
      {expiresIn: "1D"}
    )
    res.json({user, token});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});

//mogodb connection

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

  