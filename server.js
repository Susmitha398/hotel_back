require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

// Image Folder Access
app.use("/images", express.static("images"))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hotel")
.then(() => {
    console.log("DB Connected")
})
.catch((err) => {
    console.log("DB Error", err)
})

// Multer Storage
const storage = multer.diskStorage({

    destination: function(req, file, cb){
        cb(null, "images")
    },

    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }

})

const upload = multer({ storage: storage })

// Schema
const hoteltype = new mongoose.Schema({

    roomName: String,
    customerName: String,
    price: Number,
    status: String,
    image: String

})

// Table
const hotelname = mongoose.model("hotel_room_booking", hoteltype)

// INSERT
app.post("/fi", upload.single("image"), async(req, res) => {

    try{

        const data = new hotelname({

            roomName: req.body.roomName,
            customerName: req.body.customerName,
            price: req.body.price,
            status: req.body.status,
            image: req.file.filename

        })

        await data.save()

        res.status(201).json(data)

    }

    catch(err){

        res.status(500).json({message:"Insert Failed"})

    }

})

// READ
app.get("/fi", async(req, res) => {

    try{

        const fi = await hotelname.find()

        res.status(200).json(fi)

    }

    catch(err){

        res.status(500).json({message:"Read Failed"})

    }

})

// DELETE
app.delete("/fi/:id", async(req, res) => {

    try{

        await hotelname.findByIdAndDelete(req.params.id)

        res.status(200).json({message:"Delete Successfully"})

    }

    catch(err){

        res.status(500).json({message:"Delete Failed"})

    }

})

// Server
app.listen(port, () => {

    console.log("Server Connected")

})