/**
 * @param templateList 模版列表
 * @desc 把 is_default == 3 的放到第一位, 其余的按id排序，大的在前
 */
export function sortTemplateList(templateList) {
	return templateList.sort((a, b) => {
		if (a.is_default !== 3 && b.is_default !== 3) {
			return b.id - a.id
		}

		return b.is_default - a.is_default
	})
}