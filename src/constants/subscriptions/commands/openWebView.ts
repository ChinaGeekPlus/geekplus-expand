import store from "../../store";
import { loadResource } from "../../resource";
import { initWebView } from "../../../components/webview";
import initGeekPlusExpand from "../../../constants/resource/defaultValue/initGeekPlusExpand";

export const commandName = "geekplus_command.showView";
export const commandHander = () => {
    const context = store.getState("context");
    
    loadResource(context, "webview").then(() => {
        initGeekPlusExpand();
        initWebView();
    });
};