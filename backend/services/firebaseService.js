const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;

try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE;

    if (serviceAccountJson) {
        // Use the JSON string from environment variable
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log('Firebase initialized using environment variable');
    } else {
        // Use the file path
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/zetotvv-firebase-adminsdk.json';
        const absolutePath = path.isAbsolute(serviceAccountPath)
            ? serviceAccountPath
            : path.join(__dirname, '..', serviceAccountPath);
        serviceAccount = require(absolutePath);
        console.log('Firebase initialized using service account file');
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Admin:', error.message);
}

/**
 * Send push notification to multiple tokens
 * @param {string[]} tokens - Array of FCM tokens
 * @param {Object} payload - Notification payload { title, body, icon, data }
 */
const sendPushNotification = async (tokens, payload) => {
    if (!tokens || tokens.length === 0) return null;

    const message = {
        notification: {
            title: payload.title,
            body: payload.body,
        },
        data: payload.data || {},
        tokens: tokens,
    };

    // Add image if provided
    if (payload.imageUrl) {
        message.notification.image = payload.imageUrl;
        // For some platforms, we need to add it to the data payload too
        message.data.image = payload.imageUrl;
    }

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`Successfully sent: ${response.successCount} messages`);
        if (response.failureCount > 0) {
            console.log(`Failed: ${response.failureCount} messages`);
        }
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

module.exports = {
    sendPushNotification,
    admin
};
