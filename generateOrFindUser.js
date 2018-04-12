const User = require('./db/models')

function generateOrFindUser (accessToken, refreshToken, profile, done){
  // console.log(accessToken, refreshToken, profile);
  if(profile.emails[0]){
    User.findOneAndUpdate({
      email: profile.emails[0].value
    }, {
      first_name: profile.displayName || profile.username,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
      accessToken,
      refreshToken
    }, {
      upsert: true
    }, done)
  } else {
    const noEmailError = new Error('can not sign in')
    done(noEmailError, null)
  }
}

module.exports = generateOrFindUser
