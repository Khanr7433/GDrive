const Firebase = require("firebase-admin");

// Note: You'll need to add your Firebase service account JSON file
// const serviceAccount = require('../your-firebase-service-account.json');

const firebase = Firebase.initializeApp({
  // credential: Firebase.credential.cert(serviceAccount),
  // storageBucket: 'your-bucket-name.appspot.com'
});

module.exports = Firebase;
