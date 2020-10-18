const kakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback',
    }, async(accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({ where : {snsId: profile.id, provider: 'kakao'}});
            if(exUser){
                done(null, exUser);
            }else{
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider : 'kakao',
                });
                console.log('newUser: ', newUser);
                done(null, newUser);
            }
        } catch (error) {
            console.error('에러: ', error);
            done(error);
        }
    }));
};









