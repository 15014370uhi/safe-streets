const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// TODO rename to something else
async function decodeUserToken(req, res, next) {

  // Assign authorization if present
  const header = req.headers?.authorization;

  // If 'Bearer' token exists with a value within authorization header
  if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
    
    // Get token value from authorization
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      // Set decoded token value to variable 
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // Set currentUser request variable to value of decoded token
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

module.exports = decodeUserToken;