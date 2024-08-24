import { User } from "../mongoose/schemas/user.mjs";
import { testUsers } from "./constants.mjs";

export const resolveIndexByUserId = async (req, res, next) => {
    let {
        params: { username },
    } = req;
    // let {userId} = req.params;
    // let userId = req.params.userId;
    // if (isNaN(parsedId)) return res.sendStatus(400);

    let findUserIndex = await User.findOne({username});
    console.log(findUserIndex);

    // if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    // as we will be using the findUserIndex in our next hndler too, but as it is scoped in this middleware only, so we will push findUserIndex in the request body, so that we can access it easily.
    next();
}

export const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
    // if we don't call next then our website will be stuck at that poiint and will not procceed to next functions
}