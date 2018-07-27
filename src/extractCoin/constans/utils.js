export function timestampToTime(timestamp) {
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = (date.getFullYear() + '-').includes('NaN') ? "" : date.getFullYear() + '-';
	var M = ((date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-').includes('NaN') ? "" : (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() + ' ').includes('NaN') ? "" : date.getDate() < 10 ? "0" + date.getDate() + ' ' : date.getDate() + ' ';
	var h = (date.getHours() + ':').includes('NaN') ? "" : date.getHours() < 10 ? "0" + date.getHours() + ':' : date.getHours() + ':';
	var m = (date.getMinutes() + ':').includes('NaN') ? "" : date.getMinutes() < 10 ? "0" + date.getMinutes() + ':' : date.getMinutes() + ':';
	var s = date.getSeconds() || date.getSeconds() === 0 ? date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds() : "";
	// date.getSeconds() < 10 ? "0" + date.getSeconds() 

	return Y + M + D + h + m + s;
}
