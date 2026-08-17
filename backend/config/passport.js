const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const googleId = profile.id;
        const fullName = profile.displayName;
        const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;

        let user = await User.findOne({ googleId: googleId });

        if (!user) {
          user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            user.googleId = googleId;
            user.authProvider = 'google';
            if (avatar && !user.avatar) user.avatar = avatar;
            if (!user.isEmailVerified) user.isEmailVerified = true;
            await user.save();
          } else {
            user = await User.create({
              fullName: fullName,
              email: email.toLowerCase(),
              googleId: googleId,
              authProvider: 'google',
              avatar: avatar,
              isEmailVerified: true,
              phone: '',
              passwordHash: '',
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
