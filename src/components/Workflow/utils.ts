/** 生成唯一id
 * @param prefix 前缀
 * @returns 唯一id
 */
export function getUniqueId(prefix: string = "node"): string {
	// 随机数1
	const random1 = Math.floor(Math.random() * 1000000),
		// 随机数2
		random2 = Math.floor(Math.random() * 1000000),
		// 时间戳
		timestamp = new Date().getTime();
	return `${prefix}-${random1}-${random2}-${timestamp}`;
}