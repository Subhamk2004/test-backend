import passport from "passport";
import { Strategy } from "passport-discord";
import { secrets } from "../../secrets.mjs";
import { discordUser } from "../mongoose/schemas/discordUSer.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside serialize user:`);
    console.log(user);
    done(null, user.id);

})
passport.deserializeUser(async (id, done) => {
    console.log(`Inside deSerializer:`);
    console.log(id);
    try {
        let findUser = await discordUser.findById(id);
        // console.log(findUser.id);
        return findUser ? done(null, findUser) : done(null, null);
    }
    catch (error) {
        done(error, null);
    }
})
export default passport.use(
    new Strategy({
        clientID: secrets.clientId,
        clientSecret: secrets.clientSecret,
        callbackURL: secrets.callbackUrl,
        scope: ['identify', 'guilds', 'email']
    },
        async (accessToken, refreshToken, profile, done) => {
            let findUser;
            try {
                // console.log(profile);
                findUser = await discordUser.findOne({ discordId: profile.id });

            }
            catch (error) {
                return done(error, null);
            }
            try {
                if (!findUser) {
                    let newUser = new discordUser({
                        username: profile.username,
                        discordId: profile.id
                    });
                    let newSavedUser = await newUser.save();
                    return done(null, newSavedUser);
                }
                return done(null, findUser)
            }
            catch (error) {
                console.log(error);
                return done(error, null);
            }
        }
    )
)
// The flow of discord auth is as below:
// Initial Request:
// When a user clicks a "Login with Discord" button, it triggers a GET request to '/api/auth/discord'.
// Passport Authentication Initiation:
// The route '/api/auth/discord' uses passport.authenticate('discord'). This initiates the OAuth2 flow with Discord.
// If the user authorizes your app, Discord redirects back to your specified callback URL ('/api/auth/discord/redirect') with an authorization code.
// Your server receives this request at '/api/auth/discord/redirect'. Passport's middleware (passport.authenticate('discord')) handles this.
// Discord Strategy Execution:
// The function you defined in your Discord strategy is now executed:

// It receives the access token, refresh token, and user profile from Discord.
// It checks if the user already exists in your database.
// If not, it creates a new user.
// It calls done(null, user) with the user object.


// Serialization:
// After the strategy callback, Passport calls serializeUser. This determines which data of the user object should be stored in the session. In your case, it's storing the user's ID.
// Session Creation:
// The user ID is stored in the session, and a session is created in your MongoDB store.
// Response to Client:
// Your route handler sends a 200 status code back to the client, indicating successful authentication.
// Subsequent Requests:
// For future requests, Passport will:

// Extract the user ID from the session
// Call deserializeUser with this ID
// deserializeUser fetches the full user object from the database
// The user object is then attached to the request as req.user