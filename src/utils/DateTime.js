/** @format */

import { add0ToNumber } from './add0ToNumber.js';

export class DateTime {
	static dateToDateString = (val) => {
		if (val) {
			const d = new Date(val);

			return `${add0ToNumber(d.getDate())}/${add0ToNumber(
				d.getMonth() + 1
			)}/${d.getFullYear()}`;
		} else {
			return '';
		}
	};
	static CalendarDate = (val) => {
		const date = new Date(val);

		return `${date.getFullYear()}-${add0ToNumber(
			date.getMonth() + 1
		)}-${add0ToNumber(date.getDate())}`;
	};
}
