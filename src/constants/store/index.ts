import state from "./state";

class Store {
    $store: Object;
    $event: Object = {};
    constructor(state: Object) {
        this.$store = new Proxy(state, {
            set:(target, propKey: string, value: any, receiver):boolean => {
                this.$triggerEvent(`change:${propKey}`);
                return Reflect.set(target, propKey, value, receiver);
            },
        });
    }

    $on(eventName: string, eventTatget: Function) {
        const eventItem = this.$event[eventName];
        if (eventItem) {
            eventItem.push(eventTatget);
        } else {
            this.$event[eventName] = [eventTatget];
        }
    }

    $triggerEvent(eventName: string) {
        const eventItem:Function[]  = this.$event[eventName];
        if (eventItem) {
            setTimeout(() => {
                eventItem.forEach((item: Function) => item());
            } , 1);
        }
    }

    /**
     * 添加/修改 state
     * @param stateName 
     * @param stateValue 
     */
    setState(stateName: string, stateValue: any) {
        this.$store[stateName] = stateValue;
    }

    /**
     * 批量添加, 修改 state
     * @param stateMap 
     */
    setStateMap(stateMap: Object) {
        const { $store } = this;
        Object.keys(stateMap).forEach(key => {
            $store[key] = stateMap[key];
        });
    }
    
    /**
     * 获取一个或一组state的值
     * @param stateName 
     * @returns 
     */
    getState(stateName: string | string[]): any {
        const { $store } = this;
        if (typeof stateName === "object") {
            const stateMap = {};

            (stateName as string[]).forEach(item => {
                stateMap[item] = $store[item];
            });

            return stateMap;
        }
        return $store[stateName as string];
    }
}

export default new Store(state);
