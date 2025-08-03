const Router = require("express")
const upload = require("../middlewares/fileUploadMiddleware.js"); 

const router = Router();

router.post("/uploadFile",upload.single('profilePic'), (req, res) => {
    if(req.file){
        res.status(200).json({mess: "File uploaded successfully", 
            file: req.file});
    } else {
        return res.status(400).json({mess: "no file uploaded"});
    }
    console.log(req.file)
    res.status(200).json({mess: "Api is working"});
});




module.exports = router
