/** @format */

import { JWT } from 'google-auth-library';

export class HandleNotification {
	static GetAccesstoken = async (email, key) => {
		return new Promise(function (resolve, reject) {
			const jwtClient = new JWT(
				email,
				null,
				key,
				['https://www.googleapis.com/auth/cloud-platform'],
				null
			);

			jwtClient.authorize(function (err, tokens) {
				if (err) {
					reject(err);
					return;
				}

				resolve(tokens);
			});
		});
	};
}
