const OneSignal = require("@onesignal/node-onesignal");

// configuration object
const configuration = OneSignal.createConfiguration({
	restApiKey: process.env.ONE_SIGNAL_REST_API_KEY,
});

const client = new OneSignal.DefaultApi(configuration);

const sendNotification = async (title, body, ...emails) => {
	try {
		const notification = new OneSignal.Notification();
		notification.app_id = process.env.ONE_SIGNAL_APP_ID;

		notification.contents = {
			en: body,
		};

		notification.priority = 5;

		// required for Huawei
		notification.headings = {
			en: title,
		};

		// if (data) {
		// 	notification.data = data;
		// }

		// to send to a specific user
		notification.target_channel = "push";

		notification.include_aliases = {
			external_id: emails,
		};

		// // to all users
		// if (emails.length === 0) {
		// 	notification.included_segments = ["All"];
		// }

		const response = await client.createNotification(notification);

		console.log(response);

		console.log("notification sent successfully");
	} catch (err) {
		console.error(err);
		console.error("----------------------");
		console.error(await err.body.text());
	}
};

module.exports = sendNotification;
