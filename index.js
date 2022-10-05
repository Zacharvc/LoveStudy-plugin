import fs from "fs";
import ctrlCfg from "./model/ctrlCfg.js";
import { pluginName, pluginDirName } from "./model/base.js";
//
let ret = [], apps = {};
let pluginVersion = String(Object.keys(ctrlCfg.getDefSet("information", "updateLog"))[0]);
const appFiles = fs.readdirSync(`./plugins/${pluginDirName}/apps/`).filter(file => file.endsWith(".js"));
//
appFiles.forEach((file) => {
	ret.push(import(`./apps/${file}`));
});
//
ret = await Promise.allSettled(ret);
//
//启动插件输出日志
let infoLog = [
	"---------------------",
	`${pluginName}插件开始初始化...`,
];
//打印日志
for (let log of infoLog) logger.info(log);
//载入apps内JS插件
for (let item in appFiles) {
	let name = appFiles[item].replace(/(\.js)$/g, "");
	if (ret[item].status != "fulfilled") {
		logger.error(`载入插件错误：${logger.red(name)}`);
		logger.error(ret[i].reason);
		continue;
	}
	apps[name] = ret[item].value[Object.keys(ret[item].value)[0]];
}
//
logger.info(`${pluginName}插件${pluginVersion}载入成功，感谢使用！`);
//
export { pluginDirName, apps };