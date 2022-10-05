import fs from "fs";
import YAML from "yaml";
import chokidar from "chokidar";

import { pluginDirName } from "./base.js";

class ctrlCfg {
	constructor ( pluginDirName ) {
		//默认配置文件路径
		this.defSet = {};
		this.defSetPath = `./plugins/${pluginDirName}/defSet`;
		//用户配置文件路径
		this.config = {};
		this.configPath = `./plugins/${pluginDirName}/config`;
		//配置文件热更新
		this.watcher = { defSet: {}, config: {} };
	};
	//获取YAML的key值
	getYAML (app, name, type) {
		let targetFile = this.getFilePath(app, name, type), key = `${app}.${name}`;
		if (this[type][key]) return this[type][key];

		try {
			this[type][key] = YAML.parse(fs.readFileSync(targetFile, "utf8"));
		} catch (error) {
			logger.error(`[${app}][${name}] 格式错误 ${error}`);
			return false;
		}

		this.watch(file, app, name, type);
		return this[type][key];
	};
	
	getFilePath (app, name, type) {
		if (type == "defSet") return `${this.defSetPath}/${app}/${name}.yaml`;
		else return `${this.configPath}${app}.${name}.yaml`;
	};

	//监听配置文件
	watch (targetFile, app, name, type = "defSet") {
		let key = `${app}.${name}`;
		if (this.watcher[type][key]) return;
		const watcher = chokidar.watch(targetFile);
		watcher.on("change", path => {
			delete this[type][key];
			logger.mark(`[修改配置文件][${type}][${app}][${name}]`);
			if (this[`change_${app}${name}`]) {
				this[`change_${app}${name}`]();
			}
		});

		this.watcher[type][key] = watcher;
	};
	
};

export default new ctrlCfg( pluginDirName );