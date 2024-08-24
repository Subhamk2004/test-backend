import passport from "passport";
import { Strategy } from "passport-local";
import { testUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

// The flow of authentication is like this:
// app.post() will make a post request.
// After the request is recieved the data is passed to the passport.authenticate() method which will transfer the flow here to authenticate the user.
// The passport function will then transfer flow to serializeUser method which will store the data in the session(It will get called initially but after that if we made requests for login it will call deserializeUser)
// Then the flow will go to the next (req,res) middleware. and Will end the process.






// The user sends a POST request to '/api/auth' with login credentials.
// The request is received by the app.post('/api/auth', ...) route handler.
// passport.authenticate("local") middleware is called. This:

// Invokes the local strategy function you defined in localStrategy.mjs
// The strategy function checks the credentials against your user database
// If authentication succeeds, it calls done(null, user)
// If it fails, it calls done(null, false) or done(error)


// If authentication is successful, Passport calls serializeUser:

// This determines what user data to store in the session
// It's typically called once per login session, not on every request


// After serialization, the flow moves to the next middleware (req, res) => {...}

// In your case, this middleware is empty (old code is commented out)
// This is where you'd typically send a response to the client


// For subsequent authenticated requests:

// Passport retrieves the user ID from the session
// It calls deserializeUser to fetch the full user object
// This happens before your route handlers, populating req.user






//     You use passport.authenticate() as middleware in your route handler.
// This middleware handles the authentication process based on the specified strategy (e.g., Local, OAuth, etc.).

// Successful Authentication:

//     If authentication is successful, Passport attaches the authenticated user object to the req.user property.

passport.serializeUser((user, done) => {
    console.log(`Inside serialize user:`);
    console.log(user);
    done(null, user.id);

    // This determines which data of the user object should be stored in the session. Here, it's storing the user ID.
    // we can also store using username or name
    // But don't pass the whole user.
})
passport.deserializeUser(async (id, done) => {
    console.log(`Inside deSerializer:`);
    console.log(id);
    try {
        let findUser = await User.findById(id);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    }
    catch (error) {
        done(error, null);
    }
    // This retrieves the user from the database using the ID stored in the session.
})
export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            let findUser = await User.findOne({username});
            if(!findUser) throw new Error("User not found");
            if(!comparePassword(password, findUser.password)) throw new Error("Password mismatch");
            done(null, findUser);
        }
        catch (error) {
            done(`Sorry something went wrong ${error}`, null);
        }
    })
    // The cookie is only saved when the session store is modified, and in this case the passport is modfying the session store,
    // as it injects a passport filed in the session, you can check by req.session.

    // This defines how to authenticate a user. It checks if the user exists and if the password is correct.
)
// The local strategy is one of the simplest authentication strategies in Passport. 
// It allows you to authenticate users based on credentials stored in your application's database.