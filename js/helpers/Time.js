export class Time {

    //time number representation
    static getHh(time) {
        return Math.floor(time / 3600);
    }

    static getMm(time) {
        return Math.floor((time / 60) % 60);
    }

    static getSs(time) {
        return Math.floor(time % 60);
    }

    static getCs(time) {
        return parseFloat(Number.parseFloat(time % 1).toFixed(2));
    }
    //time number representation
    static parseHh(time) {
        return Time.getHh(time) < 10 ? `0${Time.getHh(time)}` : `${Time.getHh(time)}`;
    }

    static parseMm(time) {
        return Time.getMm(time) < 10 ? `0${Time.getMm(time)}` : `${Time.getMm(time)}`;
    }

    static parseSs(time) {
        return Time.getSs(time) < 10 ? `0${Time.getSs(time)}` : `${Time.getSs(time)}`;
    }

    static parseCs(time) {
        return Number.parseFloat(Time.getCs(time)).toFixed(2).replace(/0+\./, "");
    }

    //time general
    static format(time) {
        return `[${Time.parseMm(time)}:${Time.parseSs(time)}.${Time.parseCs(time)}]`;
    }
    //parse time format mm:ss.cs to seconds
    static parse(time) {
        let parsed = time.replaceAll(/[\[|\]]/g, "").split(/:|\./).map(el => Number.parseInt(el));
        return (parsed[0] * 60) + parsed[1] + (parsed[2] / 100);
    }
} 