import { Router } from "express";

let router = Router();

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies.CookieName);
    if(req.signedCookies.CookieName && req.signedCookies.CookieName === 'cookieValue')return res.send([
        {
            id: 1,
            name: "Ps5",
            price: 79.99
        },
        {
            id: 2,
            name: "Logitech driving simulator",
            price: 129.99
        },
        {
            id: 3,
            name: "SoundCore Qi0",
            price: 39.99
        }
    ])
    return res.send({msg:"Sorry, you need correct cookies"})
})

export default router;