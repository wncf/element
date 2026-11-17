// 全局 Loading 配置，由插件安装时写入，指令与服务共用
const config = {
  spinnerComponent: null,
  spinnerProps: {}
};

export const setConfig = (options = {}) => {
  if (options.spinnerComponent !== undefined) {
    config.spinnerComponent = options.spinnerComponent;
  }
  if (options.spinnerProps !== undefined) {
    config.spinnerProps = options.spinnerProps || {};
  }
};

export const getConfig = () => config;

export default config;
