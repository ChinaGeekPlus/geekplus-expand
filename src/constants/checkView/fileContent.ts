import * as fs from "fs";

export default class FileContent {
    url: string;
    data: string;
    lineContentList: Array<string>;
    curCheckLineIndex: number = 0;

    constructor(fileUrl: string) {
        this.url = fileUrl;
        this.data = fs.readFileSync(fileUrl, "utf-8");
        this.lineContentList = this.data.replace("\r", "").split("\n");
    }

    checkLine(index: number) {
        const waitLineContent: string = this.lineContentList[index];
        const execResult = [];
        const regexp: RegExp = /[\u4e00-\u9fa5]+/g;
        let r: RegExpExecArray;

        while(r = regexp.exec(waitLineContent)) {
            const start = r.index;
            const end = start + r[0].length;

            const positionData = { line: index, start, end, text: r[0] };
            
            this.isNotes(positionData) || execResult.push(positionData);
        }

        return execResult;
    }

    /**
     * 检查当前数据位置是否处于注释中
     * @param positionData 
     * @returns true or false
     */
    isNotes(positionData): Boolean {
        const waitLineContent: string = this.lineContentList[positionData.line];
        // 检查单行注释, 如果行start前存在 // 则属于注释
        const lineBeforeCont: string = waitLineContent.slice(0, positionData.start);
        return lineBeforeCont.includes("//");
    }

    /**
     * 检查下一行数据, 全部检查结束后返回null, 并重置检查起始位置
     * @returns List
     */
    next() {
        if (this.curCheckLineIndex < this.lineContentList.length) {
            return this.checkLine(this.curCheckLineIndex ++);
        } else {
            this.curCheckLineIndex = 0;
            return null;
        }
    }

    /**
     * 检查整个页面的数据
     * @returns 
     */
    checkView() {
        const result = [];
        let lineData;
        while(lineData = this.next()) {
            lineData.length && result.push(lineData);
        }
        return {
            fileUrl: this.url,
            content: this.data,
            result
        };
    }
}


// 
// // 先匹配所有的中文
// const regexp = /[\u4e00-\u9fa5]+/g;
// let r: RegExpExecArray;
// let isWrong = false;


// return { isWrong };