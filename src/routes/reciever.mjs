import { Router } from "express";

let router = Router();

router.post('/reciever',(req, res) => {
    let data = JSON.stringify(req.body);
    console.log('data is ',data);
    return res.status(200).json({message:`Message sent successfully`, data:req.body})
})

export default router;