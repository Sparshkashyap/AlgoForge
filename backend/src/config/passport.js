import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "./db.js";
import env from "./env.js";

const buildDisplayName = (profile) => {
  return (
    profile.displayName ||
    profile.username ||
    [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ") ||
    "User"
  );
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user || false);
  } catch (error) {
    done(error, null);
  }
});

if (
  env.GOOGLE_CLIENT_ID &&
  env.GOOGLE_CLIENT_SECRET &&
  env.GOOGLE_CALLBACK_URL
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Google account email not available"), null);
          }

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: buildDisplayName(profile),
                email,
                provider: "GOOGLE",
                providerId: profile.id,
                avatarUrl: profile.photos?.[0]?.value || null,
              },
            });
          } else if (!user.providerId || user.provider !== "GOOGLE") {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: "GOOGLE",
                providerId: profile.id,
                avatarUrl: user.avatarUrl || profile.photos?.[0]?.value || null,
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

if (
  env.GITHUB_CLIENT_ID &&
  env.GITHUB_CLIENT_SECRET &&
  env.GITHUB_CALLBACK_URL
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.find((item) => item.value)?.value ||
            profile._json?.email ||
            null;

          if (!email) {
            return done(
              new Error("GitHub account email not available. Keep a public email or verified primary email."),
              null
            );
          }

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: buildDisplayName(profile),
                email,
                provider: "GITHUB",
                providerId: profile.id,
                avatarUrl: profile.photos?.[0]?.value || profile._json?.avatar_url || null,
              },
            });
          } else if (!user.providerId || user.provider !== "GITHUB") {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: "GITHUB",
                providerId: profile.id,
                avatarUrl:
                  user.avatarUrl ||
                  profile.photos?.[0]?.value ||
                  profile._json?.avatar_url ||
                  null,
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

export default passport;