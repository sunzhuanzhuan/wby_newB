//自动转换数字金额为大小写中文字符,返回大小写中文字符串，最大处理到999兆
export const moneyToChinese = function changeMoneyToChinese(money) {
	let cnNums = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九"); //汉字的数字
	let cnIntRadice = new Array("", "十", "百", "千"); //基本单位
	let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
	let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
	let cnInteger = "整"; //整数金额时后面跟的字符
	let cnIntLast = "元"; //整型完以后的单位
	let maxNum = 999999999999999.9999; //最大处理的数字

	let IntegerNum; //金额整数部分
	let DecimalNum; //金额小数部分
	let ChineseStr = ""; //输出的中文金额字符串
	let parts; //分离金额后用的数组，预定义

	if (money == "") {
		return "";
	}

	money = parseFloat(money);
	//alert(money);
	if (money >= maxNum) {
		// $.alert('超出最大处理数字');
		return "";
	}
	if (money == 0) {
		ChineseStr = cnNums[0] + cnIntLast + cnInteger;
		//document.getElementById("show").value=ChineseStr;
		return ChineseStr;
	}
	money = money.toString(); //转换为字符串
	if (money.indexOf(".") == -1) {
		IntegerNum = money;
		DecimalNum = '';
	} else {
		parts = money.split(".");
		IntegerNum = parts[0];
		DecimalNum = parts[1].substr(0, 2);
	}
	if (parseInt(IntegerNum, 10) > 0) {//获取整型部分转换
		let zeroCount = 0;
		let IntLen = IntegerNum.length;
		for (let i = 0; i < IntLen; i++) {
			let n = IntegerNum.substr(i, 1);
			let p = IntLen - i - 1;
			let q = p / 4;
			let m = p % 4;
			if (n == "0") {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					ChineseStr += cnNums[0];
				}
				zeroCount = 0; //归零
				ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
			}
			if (m == 0 && zeroCount < 4) {
				ChineseStr += cnIntUnits[q];
			}
		}
		ChineseStr += cnIntLast;
		//整型部分处理完毕
	}
	if (DecimalNum != '') {//小数部分
		let decLen = DecimalNum.length;
		for (let i = 0; i < decLen; i++) {
			let n = DecimalNum.substr(i, 1);
			if (n != '0') {
				ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
			}
		}
	}
	if (ChineseStr == '') {
		ChineseStr += cnNums[0] + cnIntLast + cnInteger;
	}
	else if (DecimalNum == '') {
		ChineseStr += cnInteger;
	}
	return ChineseStr;

}
//从配置表中找到传入的key，并返回数组
export const columnsList = (configMap, configKeys) => {
	return configKeys.map(item => configMap[item])
}
