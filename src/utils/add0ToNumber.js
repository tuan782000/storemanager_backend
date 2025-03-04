/** @format */

export const add0ToNumber = (num) => (num > 9 ? `${num}` : `0${num}`);

// formatter and parser input number
export const formatterNumber = (val) => {
	if (!val) return 0;
	return `${val}`
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
		.replace(/\.(?=\d{0,2}$)/g, ',');
};

export const parserNumber = (val) => {
	if (!val) return 0;
	return Number.parseFloat(
		val.replace(/\$\s?|(\.*)/g, '').replace(/(\,{1})/g, '.')
	).toFixed(2);
};
