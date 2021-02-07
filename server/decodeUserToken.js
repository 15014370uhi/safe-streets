const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function decodeUserToken(req, res, next) {

  // Assign authorisation if present
  const header = req.headers?.authorisation;

  // If 'Bearer' token exists with a value within authorisation header
  if (header !== 'Bearer null' && req.headers?.authorisation?.startsWith('Bearer ')) {
    
    // Get token value from authorisation
    const idToken = req.headers.authorisation.split('Bearer ')[1];
    try {
      // Verify token value with firebase
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