import { Router } from "express";
import { query, checkSchema, validationResult, matchedData } from "express-validator";
import { createUserValidationSchema, checkQueryValidationSchema } from "../utils/validationSchemas.mjs";
import { testUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

let router = Router();

router.get('/api/users',
    checkSchema(checkQueryValidationSchema),
    async (request, response) => {
        let result = validationResult(request);
        // the above function handles validation results
        // console.log(result);
        console.log(request.session);
        console.log(request.session.id);
        request.sessionStore.get(request.session.id, (err, sessionData) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log("Session Data", sessionData);
        })
        let {
            query: { filter, value },
        } = request;

        if (filter && value) return response.send(
            testUsers.filter((user) => user[filter].includes(value))
        )

        let storedUsers = await User.find();
        // console.log('Stored users', storedUsers);
        return response.send(storedUsers);
        // let { query: { filter, value } } = request;

        // Extracts the query object from the request object.
        // Destructures filter and value properties from the query object.
    }
)
router.get('/api/users/:username', resolveIndexByUserId, (req, res) => {
    let { findUserIndex } = req;
    if(!findUserIndex) return res.sendStatus(404);
    return res.send(findUserIndex);
})

router.post('/api/users',
    checkSchema(createUserValidationSchema),
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) return res.send("Enter correct data");

        let data = matchedData(req);
        console.log(data);
        data.password = hashPassword(data.password)
        console.log(data);
        // let { body } = req;
        let newUser = new User(data);
        try {
            let savedUser = await newUser.save();
            return res.status(201).send(savedUser);
            console.log('User saved to the database successfully');
        } 
        catch (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }
    })

router.put('/api/users/:userId', (req, res) => {
    let {
        body,
        params: { userId }
    } = req;
    // let { ... } = req;
    //  This part uses destructuring to extract properties from the req object and assign them to new variables.
    // body: This creates a variable named body and assigns it the value of the body property from the req object. This usually contains the request body, often in JSON format.
    // params: { userId }: This creates a nested destructuring to extract the userId property from the params object within the req object
    // log req for more information

    console.log(req);
    let parsedId = parseInt(userId);
    if (isNaN(parsedId)) return res.sendStatus(400);

    let findUserIndex = testUsers.findIndex((user) => user.id === parsedId);

    if (findUserIndex === -1) return res.sendStatus(404);

    testUsers[findUserIndex] = { id: parsedId, ...body };
    return res.sendStatus(200);
})

router.patch('/api/users/:userId', (req, res) => {
    let {
        body,
        params: { userId }
    } = req;

    console.log(req);
    let parsedId = parseInt(userId);
    if (isNaN(parsedId)) return res.sendStatus(400);

    let findUserIndex = testUsers.findIndex((user) => user.id === parsedId);
    // The findIndex method iterates through each element (user object) in the testUsers

    //  array. It executes the provided callback function ((user) => user.id === parsedId) for each user.

    //  If the callback function returns true (meaning the user's id matches the parsedId), the findIndex method returns the index of that user in the array.
    //  If the callback function never returns true for any user (meaning no user has an id matching parsedId), the findIndex method returns -1
    if (findUserIndex === -1) return res.sendStatus(404);

    testUsers[findUserIndex] = { ...testUsers[findUserIndex], ...body };

    return res.sendStatus(200)
})

router.delete('/api/users/:userId', resolveIndexByUserId, (req, res) => {
    let { findUserIndex } = req;
    testUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

export default router;