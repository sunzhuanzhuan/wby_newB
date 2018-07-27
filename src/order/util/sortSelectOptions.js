import { execution_status_sort } from '../constants/optionsSort';

/**
 * 前端控制展示顺序
 * @param options 需要排序的数组
 * @returns [] 返回根据配置排序好的数组
 */

export function sortSelectOptions(options) {
	let sortedOptions = []

	options.forEach((item) => {
		let index = execution_status_sort.indexOf(item.id)
		sortedOptions[index] = item
	})

	return sortedOptions
}