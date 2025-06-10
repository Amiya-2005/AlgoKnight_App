import JWT from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;
//change it to actual secret

const createToken = (user) => {
    const payload = {
        email : user.email,
        profileId : user.profile,
    }
    const token = JWT.sign(payload, secret, {expiresIn : '1h'});

    return token;
}

const decodeToken = (token) => {
  try {
    const payload = JWT.verify(token, secret);
    return payload ;
  } catch (error) {
    return null;
  }
};

export {createToken, decodeToken};
//create token used in login.js
//validate used in middleware
