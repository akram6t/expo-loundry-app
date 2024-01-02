const admin = require('firebase-admin');

// Initialize Firebase app with your credentials
admin.initializeApp({
  credential: admin.credential.cert({
    // Replace with your service account key file
    projectId: "loundry-app-b96eb",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDSpTl5XgeLK7ZW\nq7p7G+bto1sj6ixG2iWi7mec0xBm/dRin33vPh4o9xaNr4IsxpZ8gTEvY1FLKBSi\nhT4g2QdN1TjJ5qGdVrKxGtg5pt8/OcBTlZ2A32a9L/I/W8anoxtX4zoKWgNWMfdb\n+ltChUFDktcwJSCEKcdt9EGYUTwiW5HezHdk/41B5b070d3yb7xdjjPM4v1YdcV7\naZlZLVwlNm4Sc+xeiki8AU4yskZsDeE0iKATLcc5jPZgqOvP1E48REW3WfIBNLcw\nx1gyAqRu6Hx4UDx8ftBOnUvSOYTFHU6+dFjT77K1sUKozt2iSILYh6Lizvhn2qup\nJVGpDJElAgMBAAECggEAHghwqV0+thkFZlYVwHe59SfVVsmMho2T0Cctnq55KDYI\nkgcrbXDt2+lezdS4OqoVyqqg2KDQdmbAimt08DoBUJeWATNg144E7DtnmNCyA9G4\nGjK6wiUYAOFVKLNtH3mh7GX5YIB0+VUmb3bCjDlzlK7a/4JLoIxUYtjwgUcTy9IA\nPQRv7sAgj4m1GPiei230xUa1c/wZpEX+eNUW4D1+lM5h0sxCHjI4Br49LibngZHe\ns3o1+G2PeDZbdUtv4Hp0vet6DiAo08AnH+01TAYz0HfO+BQwLiEhtvBMe1OuY2AH\nDD8INwPou029DFpJhSfYojRIAOnFyJfotkVXl642AQKBgQDuHWK/tAXBnIsokY3d\nokPuhY0MmQH+VtS10tb+KSGEJUjqaq1p/JfqIyzeZ3mOCJMMDOcw3UfOX3kYR61/\nWZB64D5ou2rXUxVRIRM+s4FP8uWiiCarxDgromQNMSuFOxGGI0thRfsedcvrxEsg\ngjNCsoKrjH0kLsEYs0FfvNpGqwKBgQDid6QaO+7a/1+2yJMjRU7d+XGER4/3GxBU\nEv7jXtSkpiXhbmdAV77pT3PkDp3TVaJG+xzKwTLoCUKrzkXNc1oJ7KyojoDi5tzo\nsHYl9BuixHW3T6MzuY4ZfiQcHmuKTgjeMAjYQ/q5F9QDxFBKSpDtdlK2wasR92jh\neeOQsGvHbwKBgQC+mx1KEaQt+M7YWbNzQAoa7CMde3nCC+XX6n+ZEnm221XD+EL6\nvW0pyqCHI9OE48457jY+wlNRmtFHo1D5yUtDYS/0DFqZJPPCbrSGE5Em22wAr/Ys\ntzSzkRmACeUpkEAV3TjhE/DR0D+9afMtgavg7x50jlA6X4bI6+0f4v/jYwKBgQCJ\nctPGmFl/0T7mURX8cjRLxPmAr25RK7vdSyooFYY56B1VlQxVoOvd7rsHz1c6zN6Q\n9hejd17ONdChNbBn4XrkSyD/rH3NOREaqP8MSfv77gEEIPGMkzILhuOjrVLXvkTj\nlYPIvnmNnUiwgJW6gUc02HubMDAD14VwU+oqBuljQQKBgQCNHY+Rb7nGqLK7B3r8\n3ZPtKmxDm5Lt8lWBAChk4YYAs7yjkrmjqUdGV7qQrb0TpO9OY2RPz5nMaMc31/X4\nalmM6luSuToj6slnLf4kdQ5F2SDgqzWv7Lbmfc9t8qSRBRWxM5M+1sUu7G/KTmEe\nYRXZjhZ9FIDMH2ln1IsCHpR5Dg==\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-bt339@loundry-app-b96eb.iam.gserviceaccount.com"
  }),
  databaseURL: 'https://loundry-app-b96eb-default-rtdb.firebaseio.com/',
});

// Function to send a notification
const sendNotification = async (deviceToken, title, message) => {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title: title,
        body: message,
      },
    };

    await admin.messaging().send(message);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = {sendNotification};