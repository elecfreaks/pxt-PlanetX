/**
* Functions to PlanetX sensor by ELECFREAKS Co.,Ltd.
*/
//% color=#00B1ED  icon="\uf005" block="PlanetX_Base" blockId="PlanetX_Base"
//% groups='["Digital", "Analog", "IIC Port"]'
namespace PlanetX_Basic {
    /////////////////////////// BME280 
    let BME280_I2C_ADDR = 0x76
    let dig_T1 = getUInt16LE(0x88)
    let dig_T2 = getInt16LE(0x8A)
    let dig_T3 = getInt16LE(0x8C)
    let dig_P1 = getUInt16LE(0x8E)
    let dig_P2 = getInt16LE(0x90)
    let dig_P3 = getInt16LE(0x92)
    let dig_P4 = getInt16LE(0x94)
    let dig_P5 = getInt16LE(0x96)
    let dig_P6 = getInt16LE(0x98)
    let dig_P7 = getInt16LE(0x9A)
    let dig_P8 = getInt16LE(0x9C)
    let dig_P9 = getInt16LE(0x9E)
    let dig_H1 = getreg(0xA1)
    let dig_H2 = getInt16LE(0xE1)
    let dig_H3 = getreg(0xE3)
    let a = getreg(0xE5)
    let dig_H4 = (getreg(0xE4) << 4) + (a % 16)
    let dig_H5 = (getreg(0xE6) << 4) + (a >> 4)
    let dig_H6 = getInt8LE(0xE7)
    let T = 0
    let P = 0
    let H = 0
    setreg(0xF2, 0x04)
    setreg(0xF4, 0x2F)
    setreg(0xF5, 0x0C)
    setreg(0xF4, 0x2F)
    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(BME280_I2C_ADDR, buf);
    }
    function getreg(reg: number): number {
        pins.i2cWriteNumber(BME280_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BME280_I2C_ADDR, NumberFormat.UInt8BE);
    }
    function getInt8LE(reg: number): number {
        pins.i2cWriteNumber(BME280_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BME280_I2C_ADDR, NumberFormat.Int8LE);
    }
    function getUInt16LE(reg: number): number {
        pins.i2cWriteNumber(BME280_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BME280_I2C_ADDR, NumberFormat.UInt16LE);
    }
    function getInt16LE(reg: number): number {
        pins.i2cWriteNumber(BME280_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(BME280_I2C_ADDR, NumberFormat.Int16LE);
    }
    function getBme280Value(): void {
        let adc_T = (getreg(0xFA) << 12) + (getreg(0xFB) << 4) + (getreg(0xFC) >> 4)
        let var1 = (((adc_T >> 3) - (dig_T1 << 1)) * dig_T2) >> 11
        let var2 = (((((adc_T >> 4) - dig_T1) * ((adc_T >> 4) - dig_T1)) >> 12) * dig_T3) >> 14
        let t = var1 + var2
        T = ((t * 5 + 128) >> 8) / 100
        var1 = (t >> 1) - 64000
        var2 = (((var1 >> 2) * (var1 >> 2)) >> 11) * dig_P6
        var2 = var2 + ((var1 * dig_P5) << 1)
        var2 = (var2 >> 2) + (dig_P4 << 16)
        var1 = (((dig_P3 * ((var1 >> 2) * (var1 >> 2)) >> 13) >> 3) + (((dig_P2) * var1) >> 1)) >> 18
        var1 = ((32768 + var1) * dig_P1) >> 15
        if (var1 == 0)
            return; // avoid exception caused by division by zero
        let adc_P = (getreg(0xF7) << 12) + (getreg(0xF8) << 4) + (getreg(0xF9) >> 4)
        let _p = ((1048576 - adc_P) - (var2 >> 12)) * 3125
        _p = (_p / var1) * 2;
        var1 = (dig_P9 * (((_p >> 3) * (_p >> 3)) >> 13)) >> 12
        var2 = (((_p >> 2)) * dig_P8) >> 13
        P = _p + ((var1 + var2 + dig_P7) >> 4)
        let adc_H = (getreg(0xFD) << 8) + getreg(0xFE)
        var1 = t - 76800
        var2 = (((adc_H << 14) - (dig_H4 << 20) - (dig_H5 * var1)) + 16384) >> 15
        var1 = var2 * (((((((var1 * dig_H6) >> 10) * (((var1 * dig_H3) >> 11) + 32768)) >> 10) + 2097152) * dig_H2 + 8192) >> 14)
        var2 = var1 - (((((var1 >> 15) * (var1 >> 15)) >> 7) * dig_H1) >> 4)
        if (var2 < 0) var2 = 0
        if (var2 > 419430400) var2 = 419430400
        H = (var2 >> 12) / 1024
    }
    ////////////////////////paj7620//////////////////////
    let gesture_first_init = true
    const initRegisterArray: number[] = [
        0xEF, 0x00, 0x32, 0x29, 0x33, 0x01, 0x34, 0x00, 0x35, 0x01, 0x36, 0x00, 0x37, 0x07, 0x38, 0x17,
        0x39, 0x06, 0x3A, 0x12, 0x3F, 0x00, 0x40, 0x02, 0x41, 0xFF, 0x42, 0x01, 0x46, 0x2D, 0x47, 0x0F,
        0x48, 0x3C, 0x49, 0x00, 0x4A, 0x1E, 0x4B, 0x00, 0x4C, 0x20, 0x4D, 0x00, 0x4E, 0x1A, 0x4F, 0x14,
        0x50, 0x00, 0x51, 0x10, 0x52, 0x00, 0x5C, 0x02, 0x5D, 0x00, 0x5E, 0x10, 0x5F, 0x3F, 0x60, 0x27,
        0x61, 0x28, 0x62, 0x00, 0x63, 0x03, 0x64, 0xF7, 0x65, 0x03, 0x66, 0xD9, 0x67, 0x03, 0x68, 0x01,
        0x69, 0xC8, 0x6A, 0x40, 0x6D, 0x04, 0x6E, 0x00, 0x6F, 0x00, 0x70, 0x80, 0x71, 0x00, 0x72, 0x00,
        0x73, 0x00, 0x74, 0xF0, 0x75, 0x00, 0x80, 0x42, 0x81, 0x44, 0x82, 0x04, 0x83, 0x20, 0x84, 0x20,
        0x85, 0x00, 0x86, 0x10, 0x87, 0x00, 0x88, 0x05, 0x89, 0x18, 0x8A, 0x10, 0x8B, 0x01, 0x8C, 0x37,
        0x8D, 0x00, 0x8E, 0xF0, 0x8F, 0x81, 0x90, 0x06, 0x91, 0x06, 0x92, 0x1E, 0x93, 0x0D, 0x94, 0x0A,
        0x95, 0x0A, 0x96, 0x0C, 0x97, 0x05, 0x98, 0x0A, 0x99, 0x41, 0x9A, 0x14, 0x9B, 0x0A, 0x9C, 0x3F,
        0x9D, 0x33, 0x9E, 0xAE, 0x9F, 0xF9, 0xA0, 0x48, 0xA1, 0x13, 0xA2, 0x10, 0xA3, 0x08, 0xA4, 0x30,
        0xA5, 0x19, 0xA6, 0x10, 0xA7, 0x08, 0xA8, 0x24, 0xA9, 0x04, 0xAA, 0x1E, 0xAB, 0x1E, 0xCC, 0x19,
        0xCD, 0x0B, 0xCE, 0x13, 0xCF, 0x64, 0xD0, 0x21, 0xD1, 0x0F, 0xD2, 0x88, 0xE0, 0x01, 0xE1, 0x04,
        0xE2, 0x41, 0xE3, 0xD6, 0xE4, 0x00, 0xE5, 0x0C, 0xE6, 0x0A, 0xE7, 0x00, 0xE8, 0x00, 0xE9, 0x00,
        0xEE, 0x07, 0xEF, 0x01, 0x00, 0x1E, 0x01, 0x1E, 0x02, 0x0F, 0x03, 0x10, 0x04, 0x02, 0x05, 0x00,
        0x06, 0xB0, 0x07, 0x04, 0x08, 0x0D, 0x09, 0x0E, 0x0A, 0x9C, 0x0B, 0x04, 0x0C, 0x05, 0x0D, 0x0F,
        0x0E, 0x02, 0x0F, 0x12, 0x10, 0x02, 0x11, 0x02, 0x12, 0x00, 0x13, 0x01, 0x14, 0x05, 0x15, 0x07,
        0x16, 0x05, 0x17, 0x07, 0x18, 0x01, 0x19, 0x04, 0x1A, 0x05, 0x1B, 0x0C, 0x1C, 0x2A, 0x1D, 0x01,
        0x1E, 0x00, 0x21, 0x00, 0x22, 0x00, 0x23, 0x00, 0x25, 0x01, 0x26, 0x00, 0x27, 0x39, 0x28, 0x7F,
        0x29, 0x08, 0x30, 0x03, 0x31, 0x00, 0x32, 0x1A, 0x33, 0x1A, 0x34, 0x07, 0x35, 0x07, 0x36, 0x01,
        0x37, 0xFF, 0x38, 0x36, 0x39, 0x07, 0x3A, 0x00, 0x3E, 0xFF, 0x3F, 0x00, 0x40, 0x77, 0x41, 0x40,
        0x42, 0x00, 0x43, 0x30, 0x44, 0xA0, 0x45, 0x5C, 0x46, 0x00, 0x47, 0x00, 0x48, 0x58, 0x4A, 0x1E,
        0x4B, 0x1E, 0x4C, 0x00, 0x4D, 0x00, 0x4E, 0xA0, 0x4F, 0x80, 0x50, 0x00, 0x51, 0x00, 0x52, 0x00,
        0x53, 0x00, 0x54, 0x00, 0x57, 0x80, 0x59, 0x10, 0x5A, 0x08, 0x5B, 0x94, 0x5C, 0xE8, 0x5D, 0x08,
        0x5E, 0x3D, 0x5F, 0x99, 0x60, 0x45, 0x61, 0x40, 0x63, 0x2D, 0x64, 0x02, 0x65, 0x96, 0x66, 0x00,
        0x67, 0x97, 0x68, 0x01, 0x69, 0xCD, 0x6A, 0x01, 0x6B, 0xB0, 0x6C, 0x04, 0x6D, 0x2C, 0x6E, 0x01,
        0x6F, 0x32, 0x71, 0x00, 0x72, 0x01, 0x73, 0x35, 0x74, 0x00, 0x75, 0x33, 0x76, 0x31, 0x77, 0x01,
        0x7C, 0x84, 0x7D, 0x03, 0x7E, 0x01
    ];
    ////////////////DHT20////////////////////////////////
    let DHT20_Addr = 0x38
    let DHT20WriteBuff = pins.createBuffer(3);
    let DHT20ReadBuff = pins.createBuffer(6);
    /////////////////////////color/////////////////////////
    const APDS9960_ADDR = 0x39
    const APDS9960_ENABLE = 0x80
    const APDS9960_ATIME = 0x81
    const APDS9960_CONTROL = 0x8F
    const APDS9960_STATUS = 0x93
    const APDS9960_CDATAL = 0x94
    const APDS9960_CDATAH = 0x95
    const APDS9960_RDATAL = 0x96
    const APDS9960_RDATAH = 0x97
    const APDS9960_GDATAL = 0x98
    const APDS9960_GDATAH = 0x99
    const APDS9960_BDATAL = 0x9A
    const APDS9960_BDATAH = 0x9B
    const APDS9960_GCONF4 = 0xAB
    const APDS9960_AICLEAR = 0xE7
    let color_first_init = false


    function i2cwrite_color(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2cread_color(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    function rgb2hsl(color_r: number, color_g: number, color_b: number): number {
        let Hue = 0
        let R = color_r * 100 / 255;
        let G = color_g * 100 / 255;
        let B = color_b * 100 / 255;
        let maxVal = Math.max(R, Math.max(G, B))
        let minVal = Math.min(R, Math.min(G, B))
        let Delta = maxVal - minVal;

        if (Delta < 0) {
            Hue = 0;
        }
        else if (maxVal == R && G >= B) {
            Hue = (60 * ((G - B) * 100 / Delta)) / 100;
        }
        else if (maxVal == R && G < B) {
            Hue = (60 * ((G - B) * 100 / Delta) + 360 * 100) / 100;
        }
        else if (maxVal == G) {
            Hue = (60 * ((B - R) * 100 / Delta) + 120 * 100) / 100;
        }
        else if (maxVal == B) {
            Hue = (60 * ((R - G) * 100 / Delta) + 240 * 100) / 100;
        }
        return Hue
    }
    function initModule(): void {
        i2cwrite_color(APDS9960_ADDR, APDS9960_ATIME, 252)
        i2cwrite_color(APDS9960_ADDR, APDS9960_CONTROL, 0x03)
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_GCONF4, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_AICLEAR, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, 0x01)
        color_first_init = true
    }
    function colorMode(): void {
        let tmp = i2cread_color(APDS9960_ADDR, APDS9960_ENABLE) | 0x2;
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, tmp);
    }

    ////////////////////////////////////////////real time clock
    let DS1307_I2C_ADDR = 104;
    let DS1307_REG_SECOND = 0
    let DS1307_REG_MINUTE = 1
    let DS1307_REG_HOUR = 2
    let DS1307_REG_WEEKDAY = 3
    let DS1307_REG_DAY = 4
    let DS1307_REG_MONTH = 5
    let DS1307_REG_YEAR = 6
    let DS1307_REG_CTRL = 7
    let DS1307_REG_RAM = 8
    function rtc_setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(DS1307_I2C_ADDR, buf);
    }
    function rtc_getReg(reg: number): number {
        pins.i2cWriteNumber(DS1307_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(DS1307_I2C_ADDR, NumberFormat.UInt8BE);
    }
    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat % 16);
    }
    function DecToHex(dat: number): number {
        return Math.idiv(dat, 10) * 16 + (dat % 10)
    }
    export function start() {
        let t = getSecond()
        setSecond(t & 0x7f)
    }
    export function setSecond(dat: number): void {
        rtc_setReg(DS1307_REG_SECOND, DecToHex(dat % 60))
    }
    export function getSecond(): number {
        return Math.min(HexToDec(rtc_getReg(DS1307_REG_SECOND)), 59)
    }
    //////////////////////////////////////////////////////MLX90615
    const MLX90615Addr = 0x5B
    const humanbody_Addr = 0x27
    const environment_Addr = 0x26

    export enum targetList {
        //% block="Human body"
        human_body,
        //% block="Environment"
        environment
    }

    export enum UnitList {
        //% block="℃"
        Centigrade,
        //% block="℉"
        Fahrenheit
    }
    function readdata(reg: NumberFormat.UInt8BE): number {
        pins.i2cWriteNumber(MLX90615Addr, reg, NumberFormat.UInt8BE, true);
        let temp = pins.i2cReadNumber(MLX90615Addr, NumberFormat.UInt16LE);
        temp *= .02
        temp -= 273.15
        return temp
    }


    ///////////////////////////////////////////////////////MP3
    let Start_Byte = 0x7E
    let Version_Byte = 0xFF
    let Command_Length = 0x06
    let End_Byte = 0xEF
    let Acknowledge = 0x00
    let CMD = 0x00
    let para1 = 0x00
    let para2 = 0x00
    let highByte = 0x00
    let lowByte = 0x00
    let dataArr: number[] = [Start_Byte, Version_Byte, Command_Length, CMD, Acknowledge, para1, para2, highByte, lowByte, End_Byte]
    /*
    * Play status selection button list
    */
    export enum playType {
        //% block="Play"
        Play = 0x0D,
        //% block="Stop"
        Stop = 0x16,
        //% block="PlayNext"
        PlayNext = 0x01,
        //% block="PlayPrevious"
        PlayPrevious = 0x02,
        //% block="Pause"
        Pause = 0x0E
    }
    function mp3_sendData(): void {
        let myBuff = pins.createBuffer(10);
        for (let i = 0; i < 10; i++) {
            myBuff.setNumber(NumberFormat.UInt8BE, i, dataArr[i])
        }
        serial.writeBuffer(myBuff)
        basic.pause(100)
    }
    function mp3_checkSum(): void {
        let total = 0;
        for (let i = 1; i < 7; i++) {
            total += dataArr[i]
        }
        total = 65536 - total
        lowByte = total & 0xFF;
        highByte = total >> 8;
        dataArr[7] = highByte
        dataArr[8] = lowByte
    }
    ////////////////////////////////////////////////////////NFC
    let NFC_I2C_ADDR = (0x48 >> 1);
    let recvBuf = pins.createBuffer(32);
    let recvAck = pins.createBuffer(8);
    let ackBuf = pins.createBuffer(6);
    let uId = pins.createBuffer(4);
    let passwdBuf = pins.createBuffer(6);
    let blockData = pins.createBuffer(16);
    let NFC_ENABLE = 0;
    const block_def = 1;
    ackBuf[0] = 0x00;
    ackBuf[1] = 0x00;
    ackBuf[2] = 0xFF;
    ackBuf[3] = 0x00;
    ackBuf[4] = 0xFF;
    ackBuf[5] = 0x00;
    passwdBuf[0] = 0xFF;
    passwdBuf[1] = 0xFF;
    passwdBuf[2] = 0xFF;
    passwdBuf[3] = 0xFF;
    passwdBuf[4] = 0xFF;
    passwdBuf[5] = 0xFF;
    function writeAndReadBuf(buf: Buffer, len: number) {
        pins.i2cWriteBuffer(NFC_I2C_ADDR, buf);
        basic.pause(100);
        recvAck = pins.i2cReadBuffer(NFC_I2C_ADDR, 8);
        basic.pause(100);
        recvBuf = pins.i2cReadBuffer(NFC_I2C_ADDR, len - 4);
    }
    function checkDcs(len: number): boolean {
        let sum = 0, dcs = 0;
        for (let i = 1; i < len - 2; i++) {
            if ((i === 4) || (i === 5)) {
                continue;
            }
            sum += recvBuf[i];
        }
        dcs = 0xFF - (sum & 0xFF);
        if (dcs != recvBuf[len - 2]) {
            return false;
        }
        return true;
    }
    function passwdCheck(id: Buffer, st: Buffer): boolean {
        let buf: number[] = [];
        buf = [0x00, 0x00, 0xFF, 0x0F, 0xF1, 0xD4, 0x40, 0x01, 0x60, 0x07, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xD1, 0xAA, 0x40, 0xEA, 0xC2, 0x00];
        let cmdPassWord = pins.createBufferFromArray(buf);
        let sum = 0, count = 0;
        cmdPassWord[9] = block_def;
        for (let i = 10; i < 16; i++)
            cmdPassWord[i] = st[i - 10];
        for (let i = 16; i < 20; i++)
            cmdPassWord[i] = id[i - 16];
        for (let i = 0; i < 20; i++) {
            if (i === 3 || i === 4) {
                continue;
            }
            sum += cmdPassWord[i];
        }
        cmdPassWord[20] = 0xff - (sum & 0xff)
        writeAndReadBuf(cmdPassWord, 15);
        for (let i = 0; i < 4; i++) {
            if (recvAck[1 + i] != ackBuf[i]) {
                serial.writeLine("psd ack ERROR!");
                return false;
            }
        }
        if ((recvBuf[6] === 0xD5) && (recvBuf[7] === 0x41) && (recvBuf[8] === 0x00) && (checkDcs(15 - 4))) {
            return true;
        }
        return false;
    }
    function wakeup() {
        basic.pause(100);
        let i = 0;
        let buf: number[] = [];
        buf = [0x00, 0x00, 0xFF, 0x05, 0xFB, 0xD4, 0x14, 0x01, 0x14, 0x01, 0x02, 0x00];
        let cmdWake = pins.createBufferFromArray(buf);
        writeAndReadBuf(cmdWake, 14);
        for (i = 0; i < ackBuf.length; i++) {
            if (recvAck[1 + i] != ackBuf[i]) {
                break;
            }
        }
        if ((i != ackBuf.length) || (recvBuf[6] != 0xD5) || (recvBuf[7] != 0x15) || (!checkDcs(14 - 4))) {
            NFC_ENABLE = 0;
        } else {
            NFC_ENABLE = 1;
        }
        basic.pause(100);
    }

    function writeblock(data: Buffer): void {
        if (!passwdCheck(uId, passwdBuf))
            return;
        let cmdWrite: number[] = [0x00, 0x00, 0xff, 0x15, 0xEB, 0xD4, 0x40, 0x01, 0xA0,
            0x06, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0xCD,
            0x00];
        let sum = 0, count = 0;
        cmdWrite[9] = block_def;
        for (let i = 10; i < 26; i++)
            cmdWrite[i] = data[i - 10];
        for (let i = 0; i < 26; i++) {
            if ((i === 3) || (i === 4)) {
                continue;
            }
            sum += cmdWrite[i];
        }
        cmdWrite[26] = 0xff - (sum & 0xff);
        let tempbuf = pins.createBufferFromArray(cmdWrite)
        writeAndReadBuf(tempbuf, 16);
    }

    ///////////////////////////////////////////////////////RJpin_to_pin
    function RJpin_to_analog(Rjpin: AnalogRJPin): any {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        return pin
    }
    function RJpin_to_digital(Rjpin: DigitalRJPin): any {
        let pin = DigitalPin.P1
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pin = DigitalPin.P8
                break;
            case DigitalRJPin.J2:
                pin = DigitalPin.P12
                break;
            case DigitalRJPin.J3:
                pin = DigitalPin.P14
                break;
            case DigitalRJPin.J4:
                pin = DigitalPin.P16
                break;
        }
        return pin
    }

    ///////////////////////////////enum
    export enum DigitalRJPin {
        //% block="J1" 
        J1,
        //% block="J2"
        J2,
        //% block="J3"
        J3,
        //% block="J4"
        J4
    }
    export enum AnalogRJPin {
        //% block="J1"
        J1,
        //% block="J2"
        J2
    }
    export enum TrackingStateType {
        //% block="● ●" enumval=0
        Tracking_State_0,

        //% block="● ◌" enumval=1
        Tracking_State_1,

        //% block="◌ ●" enumval=2
        Tracking_State_2,

        //% block="◌ ◌" enumval=3
        Tracking_State_3
    }
    export enum TrackbitStateType {
        //% block="◌ ◌ ◌ ◌" 
        Tracking_State_0 = 0,
        //% block="◌ ● ● ◌" 
        Tracking_State_1 = 6,
        //% block="◌ ◌ ● ◌" 
        Tracking_State_2 = 4,
        //% block="◌ ● ◌ ◌" 
        Tracking_State_3 = 2,


        //% block="● ◌ ◌ ●" 
        Tracking_State_4 = 9,
        //% block="● ● ● ●" 
        Tracking_State_5 = 15,
        //% block="● ◌ ● ●" 
        Tracking_State_6 = 13,
        //% block="● ● ◌ ●" 
        Tracking_State_7 = 11,

        //% block="● ◌ ◌ ◌" 
        Tracking_State_8 = 1,
        //% block="● ● ● ◌" 
        Tracking_State_9 = 7,
        //% block="● ◌ ● ◌" 
        Tracking_State_10 = 5,
        //% block="● ● ◌ ◌" 
        Tracking_State_11 = 3,

        //% block="◌ ◌ ◌ ●" 
        Tracking_State_12 = 8,
        //% block="◌ ● ● ●" 
        Tracking_State_13 = 14,
        //% block="◌ ◌ ● ●" 
        Tracking_State_14 = 12,
        //% block="◌ ● ◌ ●" 
        Tracking_State_15 = 10
    }
    export enum TrackbitType {
        //% block="◌" 
        State_0 = 0,
        //% block="●" 
        State_1 = 1
    }
    export enum TrackbitChannel {
        //% block="1"
        One = 0,
        //% block="2"
        Two = 1,
        //% block="3"
        Three = 2,
        //% block="4"
        Four = 3
    }

    export enum Distance_Unit_List {
        //% block="cm" 
        Distance_Unit_cm,

        //% block="inch"
        Distance_Unit_inch,
    }
    export enum ButtonStateList {
        //% block="C"
        C,
        //% block="D"
        D,
        //% block="C+D"
        CD
    }
    export enum RelayStateList {
        //% block="NC|Close NO|Open"
        On,

        //% block="NC|Open NO|Close"
        Off
    }
    export enum BME280_state {
        //% block="temperature(℃)"
        BME280_temperature_C,

        //% block="humidity(0~100)"
        BME280_humidity,

        //% block="pressure(hPa)"
        BME280_pressure,

        //% block="altitude(M)"
        BME280_altitude,
    }
    export enum DHT11_state {
        //% block="temperature(℃)" enumval=0
        DHT11_temperature_C,

        //% block="humidity(0~100)" enumval=1
        DHT11_humidity,
    }
    export enum DHT20_state {
        //% block="temperature(℃)" enumval=0
        DHT20_temperature_C,

        //% block="humidity(0~100)" enumval=1
        DHT20_humidity,
    }

    export enum GestureType {
        //% block="None"
        None = 0,
        //% block="Right"
        Right = 1,
        //% block="Left"
        Left = 2,
        //% block="Up"
        Up = 3,
        //% block="Down"
        Down = 4,
        //% block="Forward"
        Forward = 5,
        //% block="Backward"
        Backward = 6,
        //% block="Clockwise"
        Clockwise = 7,
        //% block="Anticlockwise"
        Anticlockwise = 8,
        //% block="Wave"
        Wave = 9
    }
    export enum ColorList {
        //% block="Red"
        red,
        //% block="Green"
        green,
        //% block="Blue"
        blue,
        //% block="Cyan"
        cyan,
        //% block="Magenta"
        magenta,
        //% block="Yellow"
        yellow,
        //% block="White"
        white
    }

    export enum GasList {
        //% block="Co"
        Co,
        //% block="Co2"
        Co2,
        //% block="Smoke"
        Smoke,
        //% block="Alcohol"
        Alcohol
    }
    export enum DataUnit {
        //% block="Year"
        Year,
        //% block="Month"
        Month,
        //% block="Day"
        Day,
        //% block="Weekday"
        Weekday,
        //% block="Hour"
        Hour,
        //% block="Minute"
        Minute,
        //% block="Second"
        Second
    }

    ///////////////////////////////////blocks/////////////////////////////
    //% blockId="readnoise" block="Noise sensor %Rjpin loudness(dB)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function noiseSensor(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        let level = 0, voltage = 0, noise = 0, h = 0, l = 0, sumh = 0, suml = 0
        for (let i = 0; i < 1000; i++) {
            level = level + pins.analogReadPin(pin)
        }
        level = level / 1000
        for (let i = 0; i < 1000; i++) {
            voltage = pins.analogReadPin(pin)
            if (voltage >= level) {
                h += 1
                sumh = sumh + voltage
            } else {
                l += 1
                suml = suml + voltage
            }
        }
        if (h == 0) {
            sumh = level
        } else {
            sumh = sumh / h
        }
        if (l == 0) {
            suml = level
        } else {
            suml = suml / l
        }
        noise = sumh - suml
        if (noise <= 4) {
            noise = pins.map(
                noise,
                0,
                4,
                30,
                50
            )
        } else if (noise <= 8) {
            noise = pins.map(
                noise,
                4,
                8,
                50,
                55
            )
        } else if (noise <= 14) {
            noise = pins.map(
                noise,
                9,
                14,
                55,
                60
            )
        } else if (noise <= 32) {
            noise = pins.map(
                noise,
                15,
                32,
                60,
                70
            )
        } else if (noise <= 60) {
            noise = pins.map(
                noise,
                33,
                60,
                70,
                75
            )
        } else if (noise <= 100) {
            noise = pins.map(
                noise,
                61,
                100,
                75,
                80
            )
        } else if (noise <= 150) {
            noise = pins.map(
                noise,
                101,
                150,
                80,
                85
            )
        } else if (noise <= 231) {
            noise = pins.map(
                noise,
                151,
                231,
                85,
                90
            )
        } else {
            noise = pins.map(
                noise,
                231,
                1023,
                90,
                120
            )
        }
        noise = Math.round(noise)
        return Math.round(noise)
    }
    //% blockId="lightSensor" block="Light sensor %Rjpin light intensity(lux)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function lightSensor(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        let voltage = 0, lightintensity = 0;
        for (let index = 0; index < 100; index++) {
            voltage = voltage + pins.analogReadPin(pin)
        }
        voltage = voltage / 100
        if (voltage < 200) {
            voltage = Math.map(voltage, 0, 200, 0, 1600)
        }
        else {
            voltage = Math.map(voltage, 200, 1023, 1600, 14000)
        }
        if (voltage < 0) {
            voltage = 0
        }
        return Math.round(voltage)
    }
    //% blockId="readsoilmoisture" block="Soil moisture sensor %Rjpin value(0~100)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function soilHumidity(Rjpin: AnalogRJPin): number {
        let voltage = 0, soilmoisture = 0;
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        voltage = pins.map(
            pins.analogReadPin(pin),
            0,
            1023,
            0,
            100
        );
        soilmoisture = 100 - voltage;
        return Math.round(soilmoisture);
    }

    //% blockId="readwaterLevel" block="Water level sensor %Rjpin value(0~100)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function waterLevel(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        let voltage = 0, waterlevel = 0;
        voltage = pins.map(
            pins.analogReadPin(pin),
            50,
            600,
            0,
            100
        );
        if (voltage < 0) {
            voltage = 0
        }
        waterlevel = voltage;
        return Math.round(waterlevel)
    }

    //% blockId="readUVLevel" block="UV sensor %Rjpin level(0~15)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function UVLevel(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        let UVlevel = pins.analogReadPin(pin);
        if (UVlevel > 625) {
            UVlevel = 625
        }
        UVlevel = pins.map(
            UVlevel,
            0,
            625,
            0,
            15
        );
        return Math.round(UVlevel)
    }
    //% blockId="gasValue" block="%sensor Gas sensor %Rjpin concentration value"
    //% Rjpin.fieldEditor="gridpicker" Rjpin.fieldOptions.columns=2
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function gasValue(sensor: GasList, Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        if (sensor == GasList.Co2) {
            return 1024 - pins.analogReadPin(pin)
        }
        return pins.analogReadPin(pin)
    }

    //% blockId=Crash block="Crash Sensor %Rjpin is pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor group="Digital" color=#EA5532 
    export function Crash(Rjpin: DigitalRJPin): boolean {
        let pin = DigitalPin.P1
        pin = RJpin_to_digital(Rjpin)
        pins.setPull(pin, PinPullMode.PullUp)
        if (pins.digitalReadPin(pin) == 0) {
            return true
        }
        else {
            return false
        }
    }

    //% blockId=sonarbit block="Ultrasonic sensor %Rjpin distance %distance_unit"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% distance_unit.fieldEditor="gridpicker"
    //% distance_unit.fieldOptions.columns=2
    //% subcategory=Sensor group="Digital" color=#EA5532
    export function ultrasoundSensor(Rjpin: DigitalRJPin, distance_unit: Distance_Unit_List): number {
        let pinT = DigitalPin.P1
        let pinE = DigitalPin.P2
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pinT = DigitalPin.P1
                pinE = DigitalPin.P8
                break;
            case DigitalRJPin.J2:
                pinT = DigitalPin.P2
                pinE = DigitalPin.P12
                break;
            case DigitalRJPin.J3:
                pinT = DigitalPin.P13
                pinE = DigitalPin.P14
                break;
            case DigitalRJPin.J4:
                pinT = DigitalPin.P15
                pinE = DigitalPin.P16
                break;
        }
        pins.setPull(pinT, PinPullMode.PullNone)
        pins.digitalWritePin(pinT, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pinT, 1)
        control.waitMicros(10)
        pins.digitalWritePin(pinT, 0)

        // read pulse
        let d = pins.pulseIn(pinE, PulseValue.High, 25000)
        let distance = d * 9 / 6 / 58

        if (distance > 400) {
            distance = 0
        }
        switch (distance_unit) {
            case Distance_Unit_List.Distance_Unit_cm:
                return Math.floor(distance)  //cm
                break
            case Distance_Unit_List.Distance_Unit_inch:
                return Math.floor(distance / 30.48)   //inch
                break
            default:
                return 0
        }
    }

    //% blockId="PIR" block="PIR sensor %Rjpin detects motion"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor group="Digital"  color=#EA5532
    export function PIR(Rjpin: DigitalRJPin): boolean {
        let pin = DigitalPin.P1
        pin = RJpin_to_digital(Rjpin)
        if (pins.digitalReadPin(pin) == 1) {
            return true
        }
        else {
            return false
        }
    }

    //% blockId="PM25" block="PM2.5 sensor %Rjpin value (μg/m³)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor group="Digital" color=#EA5532
    export function PM25(Rjpin: DigitalRJPin): number {
        let pin = DigitalPin.P1
        let pm25 = 0
        pin = RJpin_to_digital(Rjpin)
        while (pins.digitalReadPin(pin) != 0) {
        }
        while (pins.digitalReadPin(pin) != 1) {
        }
        pm25 = input.runningTime()
        while (pins.digitalReadPin(pin) != 0) {
        }
        pm25 = input.runningTime() - pm25
        return pm25
    }

    //% blockId="readdust" block="Dust sensor %Rjpin value (μg/m³)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function Dust(Rjpin: AnalogRJPin): number {
        let voltage = 0
        let dust = 0
        let vo_pin = AnalogPin.P1
        let vLED_pin = DigitalPin.P2
        switch (Rjpin) {
            case AnalogRJPin.J1:
                vo_pin = AnalogPin.P1
                vLED_pin = DigitalPin.P8
                break;
            case AnalogRJPin.J2:
                vo_pin = AnalogPin.P2
                vLED_pin = DigitalPin.P12
                break;

        }
        pins.digitalWritePin(vLED_pin, 0);
        control.waitMicros(160);
        voltage = pins.analogReadPin(vo_pin);
        control.waitMicros(100);
        pins.digitalWritePin(vLED_pin, 1);
        voltage = pins.map(
            voltage,
            0,
            1023,
            0,
            3100 / 2 * 3
        );
        dust = (voltage - 380) * 5 / 29;
        if (dust < 0) {
            dust = 0
        }
        return Math.round(dust)

    }

    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor group="Digital" color=#EA5532
    //% blockId=tracking_sensor block="Line-tracking sensor %Rjpin is %state"
    export function trackingSensor(Rjpin: DigitalRJPin, state: TrackingStateType): boolean {
        let lpin = DigitalPin.P1
        let rpin = DigitalPin.P2
        switch (Rjpin) {
            case DigitalRJPin.J1:
                lpin = DigitalPin.P1
                rpin = DigitalPin.P8
                break;
            case DigitalRJPin.J2:
                lpin = DigitalPin.P2
                rpin = DigitalPin.P12
                break;
            case DigitalRJPin.J3:
                lpin = DigitalPin.P13
                rpin = DigitalPin.P14
                break;
            case DigitalRJPin.J4:
                lpin = DigitalPin.P15
                rpin = DigitalPin.P16
                break;
        }
        pins.setPull(lpin, PinPullMode.PullUp)
        pins.setPull(rpin, PinPullMode.PullUp)
        let lsensor = pins.digitalReadPin(lpin)
        let rsensor = pins.digitalReadPin(rpin)
        if (lsensor == 0 && rsensor == 0 && state == TrackingStateType.Tracking_State_0) {
            return true;
        } else if (lsensor == 0 && rsensor == 1 && state == TrackingStateType.Tracking_State_1) {
            return true;
        } else if (lsensor == 1 && rsensor == 0 && state == TrackingStateType.Tracking_State_2) {
            return true;
        } else if (lsensor == 1 && rsensor == 1 && state == TrackingStateType.Tracking_State_3) {
            return true;
        } else return false;
    }

    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% subcategory=Sensor group="IIC Port"
    //% block="Trackbit channel %channel gray value"
    export function TrackbitgetGray(channel: TrackbitChannel): number {
        pins.i2cWriteNumber(0x1a, channel, NumberFormat.Int8LE)
        return pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
    }
    //% State.fieldEditor="gridpicker"
    //% State.fieldOptions.columns=4
    //% subcategory=Sensor group="IIC Port"
    //% block="Trackbit is %State"
    export function TrackbitState(State: TrackbitStateType): boolean {
        let TempVal: number = 0
        pins.i2cWriteNumber(0x1a, 4, NumberFormat.Int8LE)
        TempVal = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        return TempVal == State
    }
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% subcategory=Sensor group="IIC Port"
    //% block="Trackbit channel %channel is %state"
    export function TrackbitChannelState(channel: TrackbitChannel, state: TrackbitType): boolean {
        let TempVal: number = 0
        pins.i2cWriteNumber(0x1a, 4, NumberFormat.Int8LE)
        TempVal = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        if (state == TrackbitType.State_1)
            if (TempVal & 1 << channel) {
                return true
            }
            else {
                return false
            }
        else {
            if (TempVal & 1 << channel) {
                return false
            }
            else {
                return true
            }
        }
    }

    //% blockId="readdht11" block="DHT11 sensor %Rjpin %dht11state value"
    //% Rjpin.fieldEditor="gridpicker" dht11state.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2 dht11state.fieldOptions.columns=1
    //% subcategory=Sensor group="Digital" color=#EA5532
    export function dht11Sensor(Rjpin: DigitalRJPin, dht11state: DHT11_state): number {
        //initialize
        basic.pause(1000)
        let _temperature: number = -999.0
        let _humidity: number = -999.0
        let checksum: number = 0
        let checksumTmp: number = 0
        let dataArray: boolean[] = []
        let resultArray: number[] = []
        let pin = DigitalPin.P1
        pin = RJpin_to_digital(Rjpin)
        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)

        pins.setPull(pin, PinPullMode.PullUp)
        pins.digitalWritePin(pin, 0) //begin protocol, pull down pin
        basic.pause(18)
        pins.digitalReadPin(pin) //pull up pin
        control.waitMicros(40)
        while (pins.digitalReadPin(pin) == 0); //sensor response
        while (pins.digitalReadPin(pin) == 1); //sensor response

        //read data (5 bytes)
        for (let index = 0; index < 40; index++) {
            while (pins.digitalReadPin(pin) == 1);
            while (pins.digitalReadPin(pin) == 0);
            control.waitMicros(28)
            //if sensor still pull up data pin after 28 us it means 1, otherwise 0
            if (pins.digitalReadPin(pin) == 1) dataArray[index] = true
        }
        //convert byte number array to integer
        for (let index = 0; index < 5; index++)
            for (let index2 = 0; index2 < 8; index2++)
                if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)
        //verify checksum
        checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        checksum = resultArray[4]
        if (checksumTmp >= 512) checksumTmp -= 512
        if (checksumTmp >= 256) checksumTmp -= 256
        switch (dht11state) {
            case DHT11_state.DHT11_temperature_C:
                _temperature = resultArray[2] + resultArray[3] / 100
                return _temperature
            case DHT11_state.DHT11_humidity:
                _humidity = resultArray[0] + resultArray[1] / 100
                return _humidity
        }
        return 0
    }
    //% blockID="set_all_data" block="RTC IIC port set %data | %num"
    //% subcategory=Sensor group="IIC Port"
    export function setData(data: DataUnit, num: number): void {
        switch (data) {
            case DataUnit.Year:
                rtc_setReg(DS1307_REG_YEAR, DecToHex(num % 100));
                break;
            case DataUnit.Month:
                rtc_setReg(DS1307_REG_MONTH, DecToHex(num % 13));
                break;
            case DataUnit.Day:
                rtc_setReg(DS1307_REG_DAY, DecToHex(num % 32));
                break;
            case DataUnit.Weekday:
                rtc_setReg(DS1307_REG_WEEKDAY, DecToHex(num % 8))
                break;
            case DataUnit.Hour:
                rtc_setReg(DS1307_REG_HOUR, DecToHex(num % 24));
                break;
            case DataUnit.Minute:
                rtc_setReg(DS1307_REG_MINUTE, DecToHex(num % 60));
                break;
            case DataUnit.Second:
                rtc_setReg(DS1307_REG_SECOND, DecToHex(num % 60))
                break;
            default:
                break;
        }
        start();
    }
    //% blockID="get_one_data" block="RTC IIC port get %data"
    //% subcategory=Sensor group="IIC Port"
    export function readData(data: DataUnit): number {
        switch (data) {
            case DataUnit.Year:
                return Math.min(HexToDec(rtc_getReg(DS1307_REG_YEAR)), 99) + 2000
                break;
            case DataUnit.Month:
                return Math.max(Math.min(HexToDec(rtc_getReg(DS1307_REG_MONTH)), 12), 1)
                break;
            case DataUnit.Day:
                return Math.max(Math.min(HexToDec(rtc_getReg(DS1307_REG_DAY)), 31), 1)
                break;
            case DataUnit.Weekday:
                return Math.max(Math.min(HexToDec(rtc_getReg(DS1307_REG_WEEKDAY)), 7), 1)
                break;
            case DataUnit.Hour:
                return Math.min(HexToDec(rtc_getReg(DS1307_REG_HOUR)), 23)
                break;
            case DataUnit.Minute:
                return Math.min(HexToDec(rtc_getReg(DS1307_REG_MINUTE)), 59)
                break;
            case DataUnit.Second:
                return Math.min(HexToDec(rtc_getReg(DS1307_REG_SECOND)), 59)
                break;
            default:
                return 0

        }
    }
    //% block="BME280 sensor IIC port value %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=1
    //% subcategory=Sensor  group="IIC Port"
    export function bme280Sensor(state: BME280_state): number {
        getBme280Value();
        switch (state) {
            case BME280_state.BME280_temperature_C:
                return Math.round(T);
                break;
            case BME280_state.BME280_humidity:
                return Math.round(H);
                break;
            case BME280_state.BME280_pressure:
                return Math.round(P / 100);
                break;
            case BME280_state.BME280_altitude:
                return Math.round(1022 - (P / 100)) * 9
                break;
            default:
                return 0
        }
        return 0;
    }
    export class PAJ7620 {
        private paj7620WriteReg(addr: number, cmd: number) {
            let buf: Buffer = pins.createBuffer(2);
            buf[0] = addr;
            buf[1] = cmd;
            pins.i2cWriteBuffer(0x73, buf, false);
        }
        private paj7620ReadReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);
            buf[0] = addr;
            pins.i2cWriteBuffer(0x73, buf, false);
            buf = pins.i2cReadBuffer(0x73, 1, false);
            return buf[0];
        }
        private paj7620SelectBank(bank: number) {
            if (bank == 0) this.paj7620WriteReg(0xEF, 0);
            else if (bank == 1) this.paj7620WriteReg(0xEF, 1);
        }
        private paj7620Init() {
            let temp = 0;
            this.paj7620SelectBank(0);
            temp = this.paj7620ReadReg(0);
            if (temp == 0x20) {
                for (let i = 0; i < 438; i += 2) {
                    this.paj7620WriteReg(initRegisterArray[i], initRegisterArray[i + 1]);
                }
            }
            this.paj7620SelectBank(0);
        }
        init() {
            this.paj7620Init();
            basic.pause(200);
        }
        read(): number {
            let data = 0, result = 0;
            data = this.paj7620ReadReg(0x43);
            switch (data) {
                case 0x01:
                    result = GestureType.Right;
                    break;
                case 0x02:
                    result = GestureType.Left;
                    break;
                case 0x04:
                    result = GestureType.Up;
                    break;
                case 0x08:
                    result = GestureType.Down;
                    break;
                case 0x10:
                    result = GestureType.Forward;
                    break;
                case 0x20:
                    result = GestureType.Backward;
                    break;
                case 0x40:
                    result = GestureType.Clockwise;
                    break;
                case 0x80:
                    result = GestureType.Anticlockwise;
                    break;
                default:
                    data = this.paj7620ReadReg(0x44);
                    if (data == 0x01)
                        result = GestureType.Wave;
                    break;
            }
            return result;
        }
    }
    const gestureEventId = 3100;
    let lastGesture = GestureType.None;
    let paj7620 = new PAJ7620();
    //% blockId= gesture_create_event block="Gesture sensor IIC port is %gesture"
    //% gesture.fieldEditor="gridpicker" gesture.fieldOptions.columns=3
    //% subcategory=Sensor group="IIC Port"
    export function onGesture(gesture: GestureType, handler: () => void) {
        control.onEvent(gestureEventId, gesture, handler);
        if (gesture_first_init) {
            paj7620.init();
            gesture_first_init = false
        }
        control.inBackground(() => {
            while (true) {
                const gesture = paj7620.read();
                if (gesture != lastGesture) {
                    lastGesture = gesture;
                    control.raiseEvent(gestureEventId, lastGesture);
                }
                basic.pause(200);
            }
        })
    }
    //% subcategory=Sensor group="IIC Port"
    //% block="MLX90615 Infra Temp sensor IIC port %target Unit %Unit"
    export function MLX90615tempe(target: targetList, Unit: UnitList): number {
        let retemp = 0
        switch (target) {
            case targetList.human_body:
                retemp = readdata(humanbody_Addr) + 3;
                if (Unit == 1) {
                    retemp = retemp * 9 / 5 + 32
                }
                break;
            case targetList.environment:
                retemp = readdata(environment_Addr) - 5;
                if (Unit == 1) {
                    retemp = retemp * 9 / 5 + 32
                }
                break;
            default:
                retemp = 0;
        }
        return Math.round(retemp * 100) / 100
    }
    //% blockId=apds9960_readcolor block="Color sensor IIC port color HUE(0~360)"
    //% subcategory=Sensor group="IIC Port"
    export function readColor(): number {
        if (color_first_init == false) {
            initModule()
            colorMode()
        }
        let tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
        }
        let c = i2cread_color(APDS9960_ADDR, APDS9960_CDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_CDATAH) * 256;
        let r = i2cread_color(APDS9960_ADDR, APDS9960_RDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_RDATAH) * 256;
        let g = i2cread_color(APDS9960_ADDR, APDS9960_GDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_GDATAH) * 256;
        let b = i2cread_color(APDS9960_ADDR, APDS9960_BDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_BDATAH) * 256;
        // map to rgb based on clear channel
        let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;
        //let hue = rgb2hue(r, g, b);
        let hue = rgb2hsl(r, g, b)
        return hue
    }
    //% block="Color sensor IIC port detects %color"
    //% subcategory=Sensor group="IIC Port"
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    export function checkColor(color: ColorList): boolean {
        let hue = readColor()
        switch (color) {
            case ColorList.red:
                if (hue > 330 || hue < 20) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.green:
                if (hue > 110 && 150 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.blue:
                if (hue > 200 && 270 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.cyan:
                if (hue > 160 && 180 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.magenta:
                if (hue > 260 && 330 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.yellow:
                if (hue > 30 && 90 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.white:
                if (hue >= 180 && 200 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
        }
    }

    //% block="RFID sensor IIC port read data from card"
    //% subcategory=Sensor group="IIC Port"
    export function readDataBlock(): string {
        if (NFC_ENABLE === 0) {
            wakeup();
        }
        if (checkCard() === false) {
            serial.writeLine("No NFC Card!")
            return ""
        }
        if (!passwdCheck(uId, passwdBuf)) {
            serial.writeLine("passwd error!")
            return "";
        }
        let cmdRead: number[] = []
        cmdRead = [0x00, 0x00, 0xff, 0x05, 0xfb, 0xD4, 0x40, 0x01, 0x30, 0x07, 0xB4, 0x00];
        let sum = 0, count = 0;
        cmdRead[9] = block_def;
        for (let i = 0; i < cmdRead.length - 2; i++) {
            if ((i === 3) || (i === 4)) {
                continue;
            }
            sum += cmdRead[i];
        }
        cmdRead[cmdRead.length - 2] = 0xff - sum & 0xff;
        let buf = pins.createBufferFromArray(cmdRead)
        writeAndReadBuf(buf, 31);
        let ret = "";
        if ((recvBuf[6] === 0xD5) && (recvBuf[7] === 0x41) && (recvBuf[8] === 0x00) && (checkDcs(31 - 4))) {
            for (let i = 0; i < 16; i++) {
                if (recvBuf[i + 9] >= 0x20 && recvBuf[i + 9] < 0x7f) {
                    ret += String.fromCharCode(recvBuf[i + 9]) // valid ascii
                }
            }
            return ret;
        }
        return ""
    }
    //% block="RFID sensor IIC port write %data to card"
    //% subcategory=Sensor group="IIC Port"
    export function writeData(data: string): void {
        let len = data.length
        if (len > 16) {
            len = 16
        }
        for (let i = 0; i < len; i++) {
            blockData[i] = data.charCodeAt(i)
        }
        writeblock(blockData);
    }
    //% block="RFID sensor IIC port Detect Card"
    //% subcategory=Sensor group="IIC Port"
    export function checkCard(): boolean {
        if (NFC_ENABLE === 0) {
            wakeup();
        }
        let buf: number[] = [];
        buf = [0x00, 0x00, 0xFF, 0x04, 0xFC, 0xD4, 0x4A, 0x01, 0x00, 0xE1, 0x00];
        let cmdUid = pins.createBufferFromArray(buf);
        writeAndReadBuf(cmdUid, 24);
        for (let i = 0; i < 4; i++) {
            if (recvAck[1 + i] != ackBuf[i]) {
                return false;
            }
        }
        if ((recvBuf[6] != 0xD5) || (!checkDcs(24 - 4))) {
            return false;
        }
        for (let i = 0; i < uId.length; i++) {
            uId[i] = recvBuf[14 + i];
        }
        if (uId[0] === uId[1] && uId[1] === uId[2] && uId[2] === uId[3] && uId[3] === 0xFF) {
            return false;
        }
        return true;
    }

    //% blockId="readdht20" block="DHT20 sensor %dht20state value"
    //% dht20state.fieldEditor="gridpicker"
    //% dht20state.fieldOptions.columns=1
    //% subcategory=Sensor group="IIC Port"
    export function dht20Sensor(dht20state: DHT20_state): number {
        let temp, temp1, rawData = 0;
        let temperature, humidity = 0;
        DHT20WriteBuff[0] = 0xAC;
        DHT20WriteBuff[1] = 0x33;
        DHT20WriteBuff[2] = 0x00;
        pins.i2cWriteBuffer(DHT20_Addr, DHT20WriteBuff);
        basic.pause(80)
        DHT20ReadBuff = pins.i2cReadBuffer(DHT20_Addr, 6)

        rawData = 0;
        if (dht20state == DHT20_state.DHT20_temperature_C) {
            temp = DHT20ReadBuff[3] & 0xff;
            temp1 = DHT20ReadBuff[4] & 0xff;
            rawData = ((temp & 0xf) << 16) + (temp1 << 8) + (DHT20ReadBuff[5]);
            temperature = rawData / 5242 - 50;
            temperature = temperature * 100
            return Math.round(temperature) / 100;
        }
        else {
            temp = DHT20ReadBuff[1] & 0xff;
            temp1 = DHT20ReadBuff[2] & 0xff;
            rawData = (temp << 12) + (temp1 << 4) + ((DHT20ReadBuff[3] & 0xf0) >> 4);
            humidity = rawData / 0x100000;
            humidity = humidity * 10000
            return Math.round(humidity) / 100;
        }
    }

    //% blockId="potentiometer" block="Trimpot %Rjpin analog value"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Input color=#E2C438 group="Analog"
    export function trimpot(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        pin = RJpin_to_analog(Rjpin)
        return pins.analogReadPin(pin)
    }
    //% blockId=buttonab block="Button %Rjpin %button is pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=1
    //% subcategory=Input group="Digital" color=#EA5532
    export function buttonCD(Rjpin: DigitalRJPin, button: ButtonStateList): boolean {
        let pinC = DigitalPin.P1
        let pinD = DigitalPin.P2
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pinC = DigitalPin.P1
                pinD = DigitalPin.P8
                break;
            case DigitalRJPin.J2:
                pinC = DigitalPin.P2
                pinD = DigitalPin.P12
                break;
            case DigitalRJPin.J3:
                pinC = DigitalPin.P13
                pinD = DigitalPin.P14
                break;
            case DigitalRJPin.J4:
                pinC = DigitalPin.P15
                pinD = DigitalPin.P16
                break;
        }
        pins.setPull(pinC, PinPullMode.PullUp)
        pins.setPull(pinD, PinPullMode.PullUp)
        if (pins.digitalReadPin(pinD) == 0 && pins.digitalReadPin(pinC) == 0 && button == ButtonStateList.CD) {
            return true
        }
        else if (pins.digitalReadPin(pinC) == 0 && pins.digitalReadPin(pinD) == 1 && button == ButtonStateList.C) {
            return true
        }
        else if (pins.digitalReadPin(pinD) == 0 && pins.digitalReadPin(pinC) == 1 && button == ButtonStateList.D) {
            return true
        }
        else {
            return false
        }
    }

    //% blockId=fans block="Motor fan %Rjpin toggle to $fanstate || speed %speed \\%"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% fanstate.shadow="toggleOnOff"
    //% subcategory=Excute group="Digital" color=#EA5532
    //% speed.min=0 speed.max=100
    //% expandableArgumentMode="toggle"
    export function motorFan(Rjpin: DigitalRJPin, fanstate: boolean, speed: number = 100): void {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pin = AnalogPin.P1
                break;
            case DigitalRJPin.J2:
                pin = AnalogPin.P2
                break;
            case DigitalRJPin.J3:
                pin = AnalogPin.P13
                break;
            case DigitalRJPin.J4:
                pin = AnalogPin.P15
                break;
        }
        if (fanstate) {
            pins.analogSetPeriod(pin, 100)
            pins.analogWritePin(pin, Math.map(speed, 0, 100, 0, 1023))
        }
        else {
            pins.analogWritePin(pin, 0)
            speed = 0
        }
    }

    //% blockId=laserSensor block="Laser %Rjpin toggle to $laserstate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% laserstate.shadow="toggleOnOff"
    //% subcategory=Excute group="Digital" color=#EA5532
    export function laserSensor(Rjpin: DigitalRJPin, laserstate: boolean): void {
        let pin = DigitalPin.P1
        pin = RJpin_to_digital(Rjpin)
        if (laserstate) {
            pins.digitalWritePin(pin, 1)
        }
        else {
            pins.digitalWritePin(pin, 0)
        }
    }

    //% blockId=Relay block="Relay %Rjpin toggle to %Relaystate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% Relaystate.fieldEditor="gridpicker"
    //% Relaystate.fieldOptions.columns=1
    //% subcategory=Excute group="Digital" color=#EA5532
    export function Relay(Rjpin: DigitalRJPin, Relaystate: RelayStateList): void {
        let pin = DigitalPin.P1
        pin = RJpin_to_digital(Rjpin)
        switch (Relaystate) {
            case RelayStateList.On:
                pins.digitalWritePin(pin, 0)
                break;
            case RelayStateList.Off:
                pins.digitalWritePin(pin, 1)
                break;
        }
    }

    //% blockId="setLoopFolder" block="loop play all the MP3s in the folder:$folderNum"
    //% folderNum.defl="01"
    //% subcategory=Excute group="MP3" color=#EA5532
    export function setLoopFolder(folderNum: string): void {
        CMD = 0x17
        para1 = 0
        para2 = parseInt(folderNum)
        dataArr[3] = CMD
        dataArr[5] = para1
        dataArr[6] = para2
        mp3_checkSum()
        mp3_sendData()
    }

    //% blockId="folderPlay" 
    //% block="play the mp3 in the folder:$folderNum filename:$fileNum || repeatList: $myAns"
    //% folderNum.defl="01" fileNum.defl="001"
    //% myAns.shadow="toggleYesNo"
    //% expandableArgumentMode="toggle"
    //% subcategory=Excute group="MP3" color=#EA5532
    export function folderPlay(folderNum: string, fileNum: string, myAns: boolean = false): void {
        CMD = 0x0F
        para1 = parseInt(folderNum)
        para2 = parseInt(fileNum)
        dataArr[3] = CMD
        dataArr[5] = para1
        dataArr[6] = para2
        mp3_checkSum()
        mp3_sendData()
        if (myAns)
            execute(0x19)
    }

    //% blockId="setTracking" 
    //% block="play the mp3 in order of:%tracking || repeatList: $myAns"
    //% myAns.shadow="toggleYesNo"
    //% tracking.defl=1
    //% expandableArgumentMode="toggle"
    //% subcategory=Excute group="MP3" color=#EA5532
    export function setTracking(tracking: number, myAns: boolean = false): void {
        CMD = 0x03
        para1 = 0x00
        para2 = tracking
        dataArr[3] = CMD
        dataArr[5] = para1
        dataArr[6] = para2
        mp3_checkSum()
        mp3_sendData()
        execute(0x0D)
        if (myAns)
            execute(0x19)
    }
    //% blockId=MP3execute block="Set MP3 execute procedure:%myType"
    //% myType.fieldEditor="gridpicker"
    //% myType.fieldOptions.columns=2
    //% subcategory=Excute group="MP3" color=#EA5532
    export function execute(myType: playType): void {
        CMD = myType
        para1 = 0x00
        para2 = 0x00
        dataArr[3] = CMD
        dataArr[5] = para1
        dataArr[6] = para2
        mp3_checkSum()
        mp3_sendData()
    }
    //% blockId="setVolume" block="Set volume(0~25):%volume"
    //% volume.min=0 volume.max=25
    //% subcategory=Excute group="MP3" color=#EA5532
    export function setVolume(volume: number): void {
        if (volume > 25) {
            volume = 25
        }
        CMD = 0x06
        para1 = 0
        para2 = volume
        dataArr[3] = CMD
        dataArr[5] = para1
        dataArr[6] = para2
        mp3_checkSum()
        mp3_sendData()
    }
    //% blockId=MP3setPort block="Set the MP3 port to %Rjpin"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Excute group="MP3" color=#EA5532
    export function MP3SetPort(Rjpin: DigitalRJPin): void {
        let pin = SerialPin.USB_TX
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pin = SerialPin.P8
                break;
            case DigitalRJPin.J2:
                pin = SerialPin.P12
                break;
            case DigitalRJPin.J3:
                pin = SerialPin.P14
                break;
            case DigitalRJPin.J4:
                pin = SerialPin.P16
                break;
        }
        serial.redirect(
            pin,
            SerialPin.USB_RX,
            BaudRate.BaudRate9600
        )
        setVolume(25)
    }

}
