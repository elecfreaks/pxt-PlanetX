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
    let color_new_init = false

    let __dht11_last_read_time = 0;
    let __temperature: number = 0
    let __humidity: number = 0


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
    const block_def = 8;
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
            NFC_ENABLE = 2;
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

    ////////////////////////////////////////////////////////NFC_RFID_WS1850T
    let WS1850_I2CADDR = 0x28; // Set your I2C address for the MFRC522

    //MF522命令字
    let PCD_IDLE = 0x00               //NO action;取消当前命令
    let PCD_AUTHENT = 0x0E               //验证密钥
    let PCD_RECEIVE = 0x08               //接收数据
    let PCD_TRANSMIT = 0x04               //发送数据
    let PCD_TRANSCEIVE = 0x0C               //发送并接收数据
    let PCD_RESETPHASE = 0x0F               //复位
    let PCD_CALCCRC = 0x03               //CRC计算

    //Mifare_One卡片命令字
    let PICC_REQIDL = 0x26               //寻天线区内未进入休眠状态
    let PICC_REQALL = 0x52               //寻天线区内全部卡
    let PICC_ANTICOLL = 0x93               //防冲撞
    let PICC_SElECTTAG = 0x95              //选卡93
    let PICC_AUTHENT1A = 0x60               //验证A密钥
    let PICC_AUTHENT1B = 0x61               //验证B密钥
    let PICC_READ = 0x30               //读块
    let PICC_WRITE = 0xA0               //写块
    let PICC_DECREMENT = 0xC0               //扣款
    let PICC_INCREMENT = 0xC1               //充值
    let PICC_RESTORE = 0xC2               //调块数据到缓冲区
    let PICC_TRANSFER = 0xB0               //保存缓冲区中数据
    let PICC_HALT = 0x50               //休眠


    //和MF522通讯时返回的错误代码
    let MI_OK = 0
    let MI_NOTAGERR = (-1)  //1
    let MI_ERR = (-2)  //2

    //MF522 FIFO长度定义
    /////////////////////////////////////////////////////////////////////
    let DEF_FIFO_LENGTH = 64                 //FIFO size=64byte

    //------------------MFRC522寄存器---------------
    //Page 0:Command and Status
    let Reserved00 = 0x00
    let CommandReg = 0x01
    let CommIEnReg = 0x02
    let DivlEnReg = 0x03
    let CommIrqReg = 0x04
    let DivIrqReg = 0x05
    let ErrorReg = 0x06
    let Status1Reg = 0x07
    let Status2Reg = 0x08
    let FIFODataReg = 0x09
    let FIFOLevelReg = 0x0A
    let WaterLevelReg = 0x0B
    let ControlReg = 0x0C
    let BitFramingReg = 0x0D
    let CollReg = 0x0E
    let Reserved01 = 0x0F
    //Page 1:Command     
    let Reserved10 = 0x10
    let ModeReg = 0x11
    let TxModeReg = 0x12
    let RxModeReg = 0x13
    let TxControlReg = 0x14
    let TxAutoReg = 0x15
    let TxSelReg = 0x16
    let RxSelReg = 0x17
    let RxThresholdReg = 0x18
    let DemodReg = 0x19
    let Reserved11 = 0x1A
    let Reserved12 = 0x1B
    let MifareReg = 0x1C
    let Reserved13 = 0x1D
    let Reserved14 = 0x1E
    let SerialSpeedReg = 0x1F
    //Page 2:CFG    
    let Reserved20 = 0x20
    let CRCResultRegM = 0x21
    let CRCResultRegL = 0x22
    let Reserved21 = 0x23
    let ModWidthReg = 0x24
    let Reserved22 = 0x25
    let RFCfgReg = 0x26
    let GsNReg = 0x27
    let CWGsPReg = 0x28
    let ModGsPReg = 0x29
    let TModeReg = 0x2A
    let TPrescalerReg = 0x2B
    let TReloadRegH = 0x2C
    let TReloadRegL = 0x2D
    let TCounterValueRegH = 0x2E
    let TCounterValueRegL = 0x2F
    //Page 3:TestRegister     
    let Reserved30 = 0x30
    let TestSel1Reg = 0x31
    let TestSel2Reg = 0x32
    let TestPinEnReg = 0x33
    let TestPinValueReg = 0x34
    let TestBusReg = 0x35
    let AutoTestReg = 0x36
    let VersionReg = 0x37
    let AnalogTestReg = 0x38
    let TestDAC1Reg = 0x39
    let TestDAC2Reg = 0x3A
    let TestADCReg = 0x3B
    let Reserved31 = 0x3C
    let Reserved32 = 0x3D
    let Reserved33 = 0x3E
    let Reserved34 = 0x3F
    //-----------------------------------------------
    //变量
    let ws1850Type2 = 0
    let WS1850_MAX_LEN = 16;
    const WS1850BlockAdr: number[] = [8, 9, 10]
    let ws1850tuid: number[] = []
    let ws1850tretLen = 0
    let ws1850retData: number[] = []
    let ws1850status = 0
    let ws1850ChkSerNum = 0
    let ws1850retBits: number = null
    let ws1850recvData: number[] = []
    let ws1850Key = [255, 255, 255, 255, 255, 255]

    function WS1850T_IIC_Read(reg: number): number {
        pins.i2cWriteNumber(WS1850_I2CADDR, reg, NumberFormat.Int8LE);
        return pins.i2cReadNumber(WS1850_I2CADDR, NumberFormat.Int8LE);
    }

    function WS1850T_IIC_Write(reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf.setNumber(NumberFormat.Int8LE, 0, reg);
        buf.setNumber(NumberFormat.Int8LE, 1, value);
        pins.i2cWriteBuffer(WS1850_I2CADDR, buf);
    }

    //********天线开启函数**************//
    function WS1850_AntennaON() {
        let temp = WS1850T_IIC_Read(TxControlReg)//0x14控制天线驱动器管脚TX1和TX2的寄存器
        if (~(temp & 0x03)) {
            WS1850_SetBits(TxControlReg, 0x03)
        }
    }
    //*******设置使能天线发射载波13.56Mhz寄存器函数*********//
    function WS1850_SetBits(reg: number, mask: number) {
        let tmp = WS1850T_IIC_Read(reg)
        WS1850T_IIC_Write(reg, (tmp | mask))
    }

    //*******设置禁止天线发射载波13.56Mhz寄存器函数*********
    function WS1850_ClearBits(reg: number, mask: number) {
        let tmp = WS1850T_IIC_Read(reg)
        WS1850T_IIC_Write(reg, tmp & (~mask))
    }

    function WS1850_ToCard(command: number, sendData: number[]): [number, number[], number] {
        ws1850retData = []
        ws1850tretLen = 0
        ws1850status = 2
        let irqEN = 0x00
        let waitIRQ = 0x00
        let lastBits = null
        let n = 0

        if (command == PCD_AUTHENT) {
            irqEN = 0x12
            waitIRQ = 0x10
        }

        if (command == PCD_TRANSCEIVE) {
            irqEN = 0x77
            waitIRQ = 0x30
        }

        WS1850T_IIC_Write(0x02, irqEN | 0x80)
        WS1850_ClearBits(CommIrqReg, 0x80)
        WS1850_SetBits(FIFOLevelReg, 0x80)
        WS1850T_IIC_Write(CommandReg, PCD_IDLE)

        for (let o = 0; o < (sendData.length); o++) {
            WS1850T_IIC_Write(FIFODataReg, sendData[o])
        }
        WS1850T_IIC_Write(CommandReg, command)

        if (command == PCD_TRANSCEIVE) {
            WS1850_SetBits(BitFramingReg, 0x80)
        }

        let p = 1000
        while (true) {
            n = WS1850T_IIC_Read(CommIrqReg)
            p--
            if (~(p != 0 && ~(n & 0x01) && ~(n & waitIRQ))) {
                break
            }
        }
        WS1850_ClearBits(BitFramingReg, 0x80)

        if (p != 0) {
            if ((WS1850T_IIC_Read(0x06) & 0x1B) == 0x00) {
                ws1850status = 0
                if (n & irqEN & 0x01) {
                    ws1850status = 1
                }
                if (command == PCD_TRANSCEIVE) {
                    n = WS1850T_IIC_Read(FIFOLevelReg)
                    lastBits = WS1850T_IIC_Read(ControlReg) & 0x07
                    if (lastBits != 0) {
                        ws1850tretLen = (n - 1) * 8 + lastBits
                    }
                    else {
                        ws1850tretLen = n * 8
                    }
                    if (n == 0) {
                        n = 1
                    }
                    if (n > WS1850_MAX_LEN) {
                        n = WS1850_MAX_LEN
                    }
                    for (let q = 0; q < n; q++) {
                        ws1850retData.push(WS1850T_IIC_Read(FIFODataReg))
                    }
                }
            }
            else {
                ws1850status = 2
            }
        }

        return [ws1850status, ws1850retData, ws1850tretLen]
    }

    //---------------readID的第一个函数----寻卡函数-------------//
    function WS1850_Request(reqMode: number): [number, number] {
        let Type: number[] = []
        WS1850T_IIC_Write(BitFramingReg, 0x07)  //0x0d面向位的帧的调节寄存器，0x07
        Type.push(reqMode)
        let [ws1850status, ws1850retData, ws1850retBits] = WS1850_ToCard(PCD_TRANSCEIVE, Type)

        if ((ws1850status != 0) || (ws1850retBits != 16)) {
            ws1850status = 2
        }

        return [ws1850status, ws1850retBits]
    }

    //-----------------readID的第二个函数-------------------//
    function WS1850_AvoidColl(): [number, number[]] {
        let SerNum = []
        ws1850ChkSerNum = 0
        WS1850T_IIC_Write(BitFramingReg, 0)
        SerNum.push(PICC_ANTICOLL)
        SerNum.push(0x20)
        let [ws1850status, ws1850retData, ws1850retBits] = WS1850_ToCard(PCD_TRANSCEIVE, SerNum)

        if (ws1850status == 0) {
            if (ws1850retData.length == 5) {
                for (let k = 0; k <= 3; k++) {
                    ws1850ChkSerNum = ws1850ChkSerNum ^ ws1850retData[k]
                }
                if (ws1850ChkSerNum != ws1850retData[4]) {
                    ws1850status = 2
                }
            }
            else {
                ws1850status = 2
            }
        }
        return [ws1850status, ws1850retData]
    }
    //------------------readID的第三个函数---------------------//
    function WS1850_getIDNum(ws1850tuid: number[]): number {
        let a = 0

        for (let e = 0; e < 5; e++) {
            a = a * 256 + ws1850tuid[e]
        }
        return a
    }

    //---------write卡数据的第一个函数------------------------//
    function WS1850_writeToCard(txt: string): number {
        [ws1850status, ws1850Type2] = WS1850_Request(PICC_REQIDL)

        if (ws1850status != 0) {
            return null
        }
        [ws1850status, ws1850tuid] = WS1850_AvoidColl()

        if (ws1850status != 0) {
            return null
        }

        let id = WS1850_getIDNum(ws1850tuid)
        WS1850_TagSelect(ws1850tuid)
        ws1850status = WS1850_Authent(PICC_AUTHENT1A, 11, ws1850Key, ws1850tuid)
        WS1850_ReadRFID(11)

        if (ws1850status == 0) {
            let data: NumberFormat.UInt8LE[] = []
            for (let i = 0; i < txt.length; i++) {
                data.push(txt.charCodeAt(i))
            }

            for (let j = txt.length; j < 48; j++) {
                data.push(0)
            }
            //写3个块
            // let b = 0
            // for (let BlockNum2 of WS1850BlockAdr) {
            //     WS1850_WriteRFID(BlockNum2, data.slice((b * 16), ((b + 1) * 16)))
            //     b++
            // }
            //写一个块
            WS1850_WriteRFID(WS1850BlockAdr[0], data.slice(0, 16))
        }

        WS1850_Crypto1Stop()
        // serial.writeLine("Written to Card")
        return id
    }

    //---------Read读取卡M1卡数据第二个函数------------------------//
    function WS1850_TagSelect(SerNum: number[]) {
        let buff: number[] = []
        buff.push(0x93)
        buff.push(0x70)
        for (let r = 0; r < 5; r++) {
            buff.push(SerNum[r])
        }

        let pOut = WS1850_CRC_Calculation(buff)
        buff.push(pOut[0])
        buff.push(pOut[1])
        let [ws1850status, ws1850retData, ws1850tretLen] = WS1850_ToCard(PCD_TRANSCEIVE, buff)
        if ((ws1850status == 0) && (ws1850tretLen == 0x18)) {
            return ws1850retData[0]
        }
        else {
            return 0
        }
    }

    //---------Read读取卡M1卡数据第六个函数------------------------//
    function WS1850_CRC_Calculation(DataIn: number[]) {
        WS1850_ClearBits(DivIrqReg, 0x04)
        WS1850_SetBits(FIFOLevelReg, 0x80)
        for (let s = 0; s < (DataIn.length); s++) {
            WS1850T_IIC_Write(FIFODataReg, DataIn[s])
        }
        WS1850T_IIC_Write(CommandReg, 0x03)
        let t = 0xFF

        while (true) {
            let v = WS1850T_IIC_Read(DivIrqReg)
            t--
            if (!(t != 0 && !(v & 0x04))) {
                break
            }
        }

        let DataOut: number[] = []
        DataOut.push(WS1850T_IIC_Read(0x22))
        DataOut.push(WS1850T_IIC_Read(0x21))
        return DataOut
    }

    //---------Read读取卡M1卡数据第三个函数------------------------//
    function WS1850_Authent(authMode: number, WS1850BlockAdr: number, Sectorkey: number[], SerNum: number[]) {
        let buff: number[] = []
        buff.push(authMode)
        buff.push(WS1850BlockAdr)
        for (let l = 0; l < (Sectorkey.length); l++) {
            buff.push(Sectorkey[l])
        }
        for (let m = 0; m < 4; m++) {
            buff.push(SerNum[m])
        }
        [ws1850status, ws1850retData, ws1850tretLen] = WS1850_ToCard(PCD_AUTHENT, buff)
        if (ws1850status != 0) {
            serial.writeLine("AUTH ERROR!")
        }
        if ((WS1850T_IIC_Read(Status2Reg) & 0x08) == 0) {
            serial.writeLine("AUTH ERROR2!")
        }
        return ws1850status
    }

    //---------Read读取卡M1卡数据第四个函数------------------------//
    function WS1850_ReadRFID(blockAdr: number) {
        ws1850recvData = []
        ws1850recvData.push(PICC_READ)
        ws1850recvData.push(blockAdr)
        let pOut2 = []
        pOut2 = WS1850_CRC_Calculation(ws1850recvData)
        ws1850recvData.push(pOut2[0])
        ws1850recvData.push(pOut2[1])
        let [ws1850status, ws1850retData, ws1850tretLen] = WS1850_ToCard(PCD_TRANSCEIVE, ws1850recvData)

        if (ws1850status != 0) {
            serial.writeLine("Error while reading!")
        }

        if (ws1850retData.length != 16) {
            return null
        }
        else {
            return ws1850retData
        }
    }

    //---------write卡数据的第二个函数------------------------//
    function WS1850_WriteRFID(blockAdr: number, writeData: number[]) {
        let buff: number[] = []
        let crc: number[] = []

        buff.push(0xA0)
        buff.push(blockAdr)
        crc = WS1850_CRC_Calculation(buff)
        buff.push(crc[0])
        buff.push(crc[1])
        let [ws1850status, ws1850retData, ws1850tretLen] = WS1850_ToCard(PCD_TRANSCEIVE, buff)
        if ((ws1850status != 0) || (ws1850tretLen != 4) || ((ws1850retData[0] & 0x0F) != 0x0A)) {
            ws1850status = 2
            serial.writeLine("ERROR")
        }

        if (ws1850status == 0) {
            let buff2: number[] = []
            for (let w = 0; w < 16; w++) {
                buff2.push(writeData[w])
            }
            crc = WS1850_CRC_Calculation(buff2)
            buff2.push(crc[0])
            buff2.push(crc[1])
            let [ws1850status, ws1850retData, ws1850tretLen] = WS1850_ToCard(PCD_TRANSCEIVE, buff2)
            if ((ws1850status != 0) || (ws1850tretLen != 4) || ((ws1850retData[0] & 0x0F) != 0x0A)) {
                serial.writeLine("Error while writing")
            }
            else {
                serial.writeLine("Data written")
            }
        }
    }

    //---------Read读取卡M1卡数据第五个函数------------------------//
    function WS1850_Crypto1Stop() {
        WS1850_ClearBits(Status2Reg, 0x08)
    }

    //------------Read读取卡M1卡数据第一个函数------------------//
    function WS1850_readFromCard(): string {
        let [ws1850status, ws1850Type2] = WS1850_Request(PICC_REQIDL)     //寻卡+复位应答
        if (ws1850status != 0) {
            return ""
        }

        [ws1850status, ws1850tuid] = WS1850_AvoidColl()     //防多卡冲突机制

        if (ws1850status != 0) {
            return ""
        }

        let id = WS1850_getIDNum(ws1850tuid)
        WS1850_TagSelect(ws1850tuid)                  //选择卡片
        ws1850status = WS1850_Authent(PICC_AUTHENT1A, 11, ws1850Key, ws1850tuid)  //三次相互验证
        let data: NumberFormat.UInt8LE[] = []
        let text_read = ''
        let block: number[] = []
        if (ws1850status == 0) {
            // for (let BlockNum of WS1850BlockAdr) {//读3个块
            //     block = WS1850_ReadRFID(BlockNum)
            //     if (block) {
            //         data = data.concat(block)
            //     }
            // }
            data = data.concat(WS1850_ReadRFID(8))//读一个块
            if (data) {
                for (let c of data) {
                    text_read = text_read.concat(String.fromCharCode(c))
                }
            }
        }
        WS1850_Crypto1Stop()
        return text_read
    }

    // 初始化
    function WS1850_Init() {
        WS1850T_IIC_Write(CommandReg, PCD_RESETPHASE)//掉电和命令寄存器，0x0F软复位
        WS1850T_IIC_Write(TModeReg, 0x8D)//0x2A内部定时器的设置寄存器，0x8D*****
        WS1850T_IIC_Write(TPrescalerReg, 0x3E)//0x2B内部定时器的设置寄存器，0x3E***
        WS1850T_IIC_Write(TReloadRegL, 0x1E)//0x2D定义16位定时器的重载值寄存器，30***
        WS1850T_IIC_Write(TCounterValueRegH, 0x00)//0x2E 16位定时器的计数值寄存器，0
        WS1850T_IIC_Write(TxAutoReg, 0x40)//0x15控制天线驱动器设置的寄存器，0x40
        WS1850T_IIC_Write(ModeReg, 0x3D)//0x11当以发送和接收通用模式的寄存器，0x3D
        WS1850_AntennaON()
    }

    //扫描ic卡
    function WS1850_scan(): boolean {
        WS1850_Init();

        [ws1850status, ws1850Type2] = WS1850_Request(PICC_REQIDL)  //寻卡+复位应答

        if (ws1850status != 0) {
            return false
        }
        [ws1850status, ws1850tuid] = WS1850_AvoidColl()

        if (ws1850status != 0) {
            return false
        }

        if (WS1850_getIDNum(ws1850tuid) == 0) {
            return false
        }
        else {
            return true
        }
    }

    //**************Read读取卡M1卡数据主函数***********/
    //*****读取的卡数据read()处理函数***********//
    //*****由于卡2扇区数据共48个字节（即48个字符），填入数据后，未填写的数据会自动补字符0（即16进制的0X20）***********//
    //*****仅显示有效字符串，去除补位字符0 *//
    function WS1850_Read(): string {               //数据长度48个字节
        let text = WS1850_readFromCard()
        let i = 1;
        while (!text) {
            text = WS1850_readFromCard();
            if (i-- <= 0) {
                break;
            }
        }
        let strlenth = text.length;
        while (strlenth) {
            if (text[strlenth - 1].charCodeAt(0) == 0x00) {
                strlenth--;
            }
            else {
                break;
            }
        }

        strlenth = strlenth > 16 ? 16 : strlenth

        return text.slice(0, strlenth)


        // let manage_DATA: string
        // let m_DATA_1: string = text
        // manage_DATA = m_DATA_1 != null ? m_DATA_1.trim() : 'NULL'   //.trim()为js语言去除两端空格的函数
        // return text
    }

    /**************write卡数据的主函数*********************/
    export function WS1850_Write(str: string) {
        let id = WS1850_writeToCard(str)

        let flag = 1;
        while (!id && flag <= 2) {
            let id = WS1850_writeToCard(str)

            flag += 1
        }
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

    //////////////////////////////////////////////////////////////TrackBit
    let TrackBit_state_value: number = 0

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
    export enum TrackBit_gray {
        //% block="line"
        One = 0,
        //% block="background"
        Two = 4
    }


    export enum Distance_Unit_List {
        //% block="cm" 
        Distance_Unit_cm,

        //% block="foot"
        Distance_Unit_foot,
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

    export enum joyvalEnum {
        //% block="x"
        x,
        //% block="y"
        y
    }

    export enum joykeyEnum {
        //% block="pressed"
        pressed = 1,
        //% block="unpressed"
        unpressed = 0
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

    let distance_last = 0

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
        let version = control.hardwareVersion()
        let distance = d * 34 / 2 / 1000
        if (version == "1") {
            distance = distance * 3 / 2
        }

        if (distance > 430) {
            distance = 0
        }

        if (distance == 0) {
            distance = distance_last
            distance_last = 0
        }
        else {
            distance_last = distance
        }

        switch (distance_unit) {
            case Distance_Unit_List.Distance_Unit_cm:
                return Math.floor(distance)  //cm
                break
            case Distance_Unit_List.Distance_Unit_foot:
                return Math.floor(distance / 30.48)   //foot
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

    /**
    * Get gray value.The range is from 0 to 255.
    */
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
        return TrackBit_state_value == State
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

    //% deprecated=true
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% detect_target.fieldEditor="gridpicker" detect_target.fieldOptions.columns=2
    //% subcategory=Sensor group="IIC Port"
    //% block="Trackbit Init_Sensor_Val channel %channel detection target %detect_target value"
    export function Trackbit_Init_Sensor_Val(channel: TrackbitChannel, detect_target: TrackBit_gray): number {
        let Init_Sensor_Val = pins.createBuffer(8)
        pins.i2cWriteNumber(0x1a, 5, NumberFormat.Int8LE)
        Init_Sensor_Val = pins.i2cReadBuffer(0x1a, 8)
        return Init_Sensor_Val[channel + detect_target]
    }


    //% deprecated=true
    //% val.min=0 val.max=255
    //% subcategory=Sensor group="IIC Port"
    //% block="Set Trackbit learn fail value %val"
    export function Trackbit_learn_fail_value(val: number) {
        pins.i2cWriteNumber(0x1a, 6, NumberFormat.Int8LE)
        pins.i2cWriteNumber(0x1a, val, NumberFormat.Int8LE)
    }

    /**
    * Gets the position offset.The range is from -3000 to 3000.
    */
    //% sensor_number.fieldEditor="gridpicker" sensor_number.fieldOptions.columns=2
    //% subcategory=Sensor group="IIC Port"
    //% block="Trackbit sensor offset value"
    export function TrackBit_get_offset(): number {
        let offset: number
        pins.i2cWriteNumber(0x1a, 5, NumberFormat.Int8LE)
        const offsetH = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        pins.i2cWriteNumber(0x1a, 6, NumberFormat.Int8LE)
        const offsetL = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        offset = (offsetH << 8) | offsetL
        offset = Math.map(offset, 0, 6000, -3000, 3000)
        return offset;
    }

    //% subcategory=Sensor group="IIC Port"
    //% block="Get a Trackbit state value"
    export function Trackbit_get_state_value() {
        pins.i2cWriteNumber(0x1a, 4, NumberFormat.Int8LE)
        TrackBit_state_value = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        basic.pause(5);
    }

    function waitDigitalReadPin(state: number, timeout: number, pin: DigitalPin) {
        while (pins.digitalReadPin(pin) != state) {
            if (!(--timeout)) {
                return 0
            }
        };
        return 1
    }

    function delay_us(us: number) {
        // control.waitMicros(us)
        let time = input.runningTimeMicros() + us;
        while (input.runningTimeMicros() < time);
    }

    //% blockId="readdht11" block="DHT11 sensor %Rjpin %dht11state value"
    //% Rjpin.fieldEditor="gridpicker" dht11state.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2 dht11state.fieldOptions.columns=1
    //% subcategory=Sensor group="Digital" color=#EA5532
    export function dht11Sensor(Rjpin: DigitalRJPin, dht11state: DHT11_state): number {
        //initialize
        if (__dht11_last_read_time != 0 && __dht11_last_read_time + 1000 > input.runningTime()) {
            switch (dht11state) {
                case DHT11_state.DHT11_temperature_C:
                    return __temperature
                case DHT11_state.DHT11_humidity:
                    return __humidity
            }
        }
        let fail_flag: number = 0
        let pin = DigitalPin.P1
        pin = RJpin_to_digital(Rjpin)
        pins.setPull(pin, PinPullMode.PullUp)
        for (let count = 0; count < (__dht11_last_read_time == 0 ? 50 : 10); count++) {
            if (count != 0) {
                basic.pause(5);
            }
            fail_flag = 0;
            // 拉高1us后拉低代表重置
            pins.digitalWritePin(pin, 1)
            delay_us(1)
            pins.digitalWritePin(pin, 0)
            basic.pause(18)
            // 等待18ms后拉高代表开始
            pins.digitalWritePin(pin, 1) //pull up pin for 18us
            delay_us(30)
            pins.digitalReadPin(pin);
            if (!(waitDigitalReadPin(1, 9999, pin))) continue;
            if (!(waitDigitalReadPin(0, 9999, pin))) continue;
            //read data (5 bytes)
            let data_arr = [0, 0, 0, 0, 0];
            let i, j;
            for (i = 0; i < 5; i++) {
                for (j = 0; j < 8; j++) {
                    if (!(waitDigitalReadPin(0, 9999, pin))) {
                        fail_flag = 1
                        break;
                    }
                    if (!(waitDigitalReadPin(1, 9999, pin))) {
                        fail_flag = 1
                        break;
                    }
                    delay_us(40)
                    //if sensor still pull up data pin after 28 us it means 1, otherwise 0
                    if (pins.digitalReadPin(pin) == 1) {
                        data_arr[i] |= 1 << (7 - j)
                    }
                }
                if (fail_flag) break;
            }
            if (fail_flag) {
                continue;
            };

            if (data_arr[4] == ((data_arr[0] + data_arr[1] + data_arr[2] + data_arr[3]) & 0xFF)) {
                __temperature = data_arr[2] + data_arr[3] / 10
                __humidity = data_arr[0] + data_arr[1] / 10
                __dht11_last_read_time = input.runningTime();
                break;
            }
            fail_flag = 1;
        }
        switch (dht11state) {
            case DHT11_state.DHT11_temperature_C:
                return __temperature
            case DHT11_state.DHT11_humidity:
                return __humidity
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

    //% blockId= gesture_create_event block="onGestureInit"
    //% gesture.fieldEditor="gridpicker" gesture.fieldOptions.columns=3
    //% subcategory=Sensor group="IIC Port"
    function onGestureInit() {
        paj7620.init();
    }

    //% deprecated=true
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
        let buf = pins.createBuffer(2)
        let c = 0
        let r = 0
        let g = 0
        let b = 0
        let temp_c = 0
        let temp_r = 0
        let temp_g = 0
        let temp_b = 0
        let temp = 0

        if (color_new_init == false && color_first_init == false) {
            let i = 0;
            while (i++ < 20) {
                buf[0] = 0x81
                buf[1] = 0xCA
                pins.i2cWriteBuffer(0x43, buf)
                buf[0] = 0x80
                buf[1] = 0x17
                pins.i2cWriteBuffer(0x43, buf)
                basic.pause(50);

                if ((i2cread_color(0x43, 0xA4) + i2cread_color(0x43, 0xA5) * 256) != 0) {
                    color_new_init = true
                    break;
                }
            }
        }
        if (color_new_init == true) {
            basic.pause(100);
            c = i2cread_color(0x43, 0xA6) + i2cread_color(0x43, 0xA7) * 256;
            r = i2cread_color(0x43, 0xA0) + i2cread_color(0x43, 0xA1) * 256;
            g = i2cread_color(0x43, 0xA2) + i2cread_color(0x43, 0xA3) * 256;
            b = i2cread_color(0x43, 0xA4) + i2cread_color(0x43, 0xA5) * 256;

            r *= 1.3 * 0.47 * 0.83
            g *= 0.69 * 0.56 * 0.83
            b *= 0.80 * 0.415 * 0.83
            c *= 0.3

            if (r > b && r > g) {
                b *= 1.18;
                g *= 0.95
            }

            temp_c = c
            temp_r = r
            temp_g = g
            temp_b = b

            r = Math.min(r, 4095.9356)
            g = Math.min(g, 4095.9356)
            b = Math.min(b, 4095.9356)
            c = Math.min(c, 4095.9356)

            if (temp_b < temp_g) {
                temp = temp_b
                temp_b = temp_g
                temp_g = temp
            }
        }
        else {
            if (color_first_init == false) {
                initModule()
                colorMode()
            }
            let tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
            while (!tmp) {
                basic.pause(5);
                tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
            }
            c = i2cread_color(APDS9960_ADDR, APDS9960_CDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_CDATAH) * 256;
            r = i2cread_color(APDS9960_ADDR, APDS9960_RDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_RDATAH) * 256;
            g = i2cread_color(APDS9960_ADDR, APDS9960_GDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_GDATAH) * 256;
            b = i2cread_color(APDS9960_ADDR, APDS9960_BDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_BDATAH) * 256;
        }

        serial.writeNumber(r)
        serial.writeLine("r")
        serial.writeNumber(g)
        serial.writeLine("g")
        serial.writeNumber(b)
        serial.writeLine("b")
        serial.writeNumber(c)
        serial.writeLine("c")

        // map to rgb based on clear channel
        let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;
        //let hue = rgb2hue(r, g, b);
        let hue = rgb2hsl(r, g, b)
        if (color_new_init == true && hue >= 180 && hue <= 201 && temp_c >= 6000 && (temp_b - temp_g) < 1000 || (temp_r > 4096 && temp_g > 4096 && temp_b > 4096)) {
            temp_c = Math.map(temp_c, 0, 15000, 0, 13000);
            hue = 180 + (13000 - temp_c) / 1000.0;
        }
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
                if (hue > 120 && 180 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.blue:
                if (hue > 210 && 270 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.cyan:
                if (hue > 190 && 210 > hue) {
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
                if (hue > 30 && 120 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.white:
                if (hue >= 180 && 190 > hue) {
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

        if (NFC_ENABLE === 2) {
            return WS1850_Read();
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
        if (NFC_ENABLE === 0) {
            wakeup();
        }
        if (NFC_ENABLE === 2) {
            WS1850_Write(data);
            return;
        }
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
        if (NFC_ENABLE === 2) {
            return WS1850_scan();
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

    //% deprecated=true
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

    //% deprecated=true
    //% block="joystick sensor %state value"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=2
    //% subcategory=Sensor group="IIC Port"
    export function joystickval(state: joyvalEnum): number {
        let buff = pins.createBuffer(3)
        let x_val, y_val
        buff = pins.i2cReadBuffer(0xaa, 3)
        if (state == joyvalEnum.x) {
            x_val = buff[0] * 4 - 512
            if (x_val > -10 && x_val < 10) {
                x_val = 0
            }
            return x_val
        }
        else {
            y_val = buff[1] * 4 - 512
            if (y_val > -10 && y_val < 10) {
                y_val = 0
            }
            return y_val
        }
        return 0
    }

    //% deprecated=true
    //% block="joystick sensor %key key"
    //% key.fieldEditor="gridpicker"
    //% key.fieldOptions.columns=2
    //% subcategory=Sensor group="IIC Port"
    export function joystickkey(key: joykeyEnum): boolean {
        let buff = pins.createBuffer(3)
        buff = pins.i2cReadBuffer(0xaa, 3)
        return key == buff[2]
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

    export enum ButtonState {
        //% block="on"
        on = 1,
        //% block="off"
        off = 2
    }

    const buttonEventSource = 5000
    const buttonEventValue = {
        CD_pressed: ButtonState.on,
        CD_unpressed: ButtonState.off
    }

    //% block="on button %Rjpin %button pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=1
    //% subcategory=Input group="Digital" color=#EA5532
    export function buttonEvent(Rjpin: DigitalRJPin, button: ButtonStateList, handler: () => void) {
        let ButtonPin_C = DigitalPin.P1
        let ButtonPin_D = DigitalPin.P2
        let pinEventSource_C = EventBusSource.MICROBIT_ID_IO_P0
        let pinEventSource_D = EventBusSource.MICROBIT_ID_IO_P1
        switch (Rjpin) {
            case DigitalRJPin.J1:
                ButtonPin_C = DigitalPin.P1
                ButtonPin_D = DigitalPin.P8
                pinEventSource_C = EventBusSource.MICROBIT_ID_IO_P1
                pinEventSource_D = EventBusSource.MICROBIT_ID_IO_P8
                break;
            case DigitalRJPin.J2:
                ButtonPin_C = DigitalPin.P2
                ButtonPin_D = DigitalPin.P12
                pinEventSource_C = EventBusSource.MICROBIT_ID_IO_P2
                pinEventSource_D = EventBusSource.MICROBIT_ID_IO_P12
                break;
            case DigitalRJPin.J3:
                ButtonPin_C = DigitalPin.P13
                ButtonPin_D = DigitalPin.P14
                pinEventSource_C = EventBusSource.MICROBIT_ID_IO_P13
                pinEventSource_D = EventBusSource.MICROBIT_ID_IO_P14
                break;
            case DigitalRJPin.J4:
                ButtonPin_C = DigitalPin.P15
                ButtonPin_D = DigitalPin.P16
                pinEventSource_C = EventBusSource.MICROBIT_ID_IO_P15
                pinEventSource_D = EventBusSource.MICROBIT_ID_IO_P16
                break;
        }
        if (button == ButtonStateList.C) {
            pins.setPull(ButtonPin_C, PinPullMode.PullUp)
            pins.setEvents(ButtonPin_C, PinEventType.Edge)
            control.onEvent(pinEventSource_C, EventBusValue.MICROBIT_PIN_EVT_RISE, handler)
        }
        else if (button == ButtonStateList.D) {
            pins.setPull(ButtonPin_D, PinPullMode.PullUp)
            pins.setEvents(ButtonPin_D, PinEventType.Edge)
            control.onEvent(pinEventSource_D, EventBusValue.MICROBIT_PIN_EVT_RISE, handler)
        }
        else if (button == ButtonStateList.CD) {
            loops.everyInterval(50, function () {
                if (pins.digitalReadPin(ButtonPin_C) == 0 && pins.digitalReadPin(ButtonPin_D) == 0) {
                    control.raiseEvent(buttonEventSource, buttonEventValue.CD_pressed)
                }
            })
            control.onEvent(buttonEventSource, buttonEventValue.CD_pressed, handler)
        }
    }

    //% blockId=fans block="Motor fan %Rjpin toggle to $fanstate || speed %speed \\%"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% fanstate.shadow="toggleOnOff"
    //% subcategory=Execute group="Digital" color=#EA5532
    //% speed.min=0 speed.max=100 speed.defl=50
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
    //% subcategory=Execute group="Digital" color=#EA5532
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

    //% blockId=magnet block="magnet %Rjpin toggle to $magnetstate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% magnetstate.shadow="toggleOnOff"
    //% subcategory=Execute group="Digital" color=#EA5532
    export function magnet(Rjpin: DigitalRJPin, magnetstate: boolean): void {
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
        if (magnetstate) {
            pins.digitalWritePin(pin, 1)
        }
        else {
            pins.digitalWritePin(pin, 0)
        }
    }

    //% deprecated=true
    //% blockId=Relay block="Relay %Rjpin toggle to %Relaystate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% Relaystate.fieldEditor="gridpicker"
    //% Relaystate.fieldOptions.columns=1
    //% subcategory=Execute group="Digital" color=#EA5532
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
    //% subcategory=Execute group="MP3" color=#EA5532
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
    //% subcategory=Execute group="MP3" color=#EA5532
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
    //% subcategory=Execute group="MP3" color=#EA5532
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
    //% subcategory=Execute group="MP3" color=#EA5532
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
    //% subcategory=Execute group="MP3" color=#EA5532
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
    //% subcategory=Execute group="MP3" color=#EA5532
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

    export enum value_level {
        /**
         * Attention greater than 35
         */
        //% block="⬆"
        UP = 5,
        /**
         * Attention greater than 50
         */
        //% block="⬇"
        DOWN = 7,
        /**
         * Attention greater than 65
         */
        //% block="⬅"
        LEFT = 8,
        /**
        * Attention greater than 35
        */
        //% block="➡"
        RIGHT = 6,
        /**
         * Attention greater than 50
         */
        //% block="▷"
        Tri = 13,
        /**
         * Attention greater than 65
         */
        //% block="☐"
        Squ = 16,
        /**
        * Attention greater than 35
        */
        //% block="𐤏"
        Cir = 14,
        /**
         * Attention greater than 50
         */
        //% block="⨉"
        X = 15,
        /**
         * Attention greater than 65
         */
        //% block="L1"
        Left1 = 11,
        /**
        * Attention greater than 35
        */
        //% block="R1"
        Right1 = 12,
        /**
         * Attention greater than 50
         */
        //% block="L2"
        Left2 = 9,
        /**
         * Attention greater than 65
         */
        //% block="R2"
        Right2 = 10,
        /**
        * Attention greater than 35
        */
        //% block="SELECT"
        Sele = 1,
        /**
         * Attention greater than 50
         */
        //% block="START"
        Star = 4,
        /**
         * Attention greater than 50
         */
        //% block="L3"
        L3 = 2,
        /**
         * Attention greater than 50
         */
        //% block="R3"
        R3 = 3,
    }

    export enum LR_value {

        /**
         * Attention greater than L
         */
        //% block="L"
        LEFT = 0,
        /**
         * Attention greater than R
         */
        //% block="R"
        RIGHT = 2,


    }

    export enum value_Analog {
        /**
        * Attention greater than 35
        */
        //% block="↖"
        LUP = 9,
        /**
        * Attention greater than 35
        */
        //% block="⬆"
        UP = 5,
        /**
        * Attention greater than 35
        */
        //% block="↗"
        RUP = 10,
        /**
         * Attention greater than 65
         */
        //% block="⬅"
        LEFT = 7,
        /**
        * 32
        */
        //% block="P"
        P = 13,
        /**
        * Attention greater than 35
        */
        //% block="➡"
        RIGHT = 8,
        /*
        * Attention greater than 35
        */
        //% block="↙"
        LDOWN = 11,
        /**
        * Attention greater than 50
        */
        //% block="⬇"
        DOWN = 6,
        /**
        * Attention greater than 50
        */
        //% block="↘"
        RDOWN = 12,
        // /**
        //  * 33
        //  */
        // //% block="right3"
        // Button_R3 = 33,
        // /**
        //  * Attention greater than 35
        //  */
        // //% block="R⬆"
        // R_UP = 7,
        // /**
        //  * Attention greater than 50
        //  */
        // //% block="R⬇"
        // R_DOWN = 7,
        // /**
        //  * Attention greater than 65
        //  */
        // //% block="R⬅"
        // R_LEFT = 7,
        // /**
        // * Attention greater than 35
        // */
        // //% block="R➡"
        // R_RIGHT = 7,
        // /**
        // * Attention greater than 35
        // */
        // //% block="R↖"
        // R_LUP = 8,
        // /**
        // * Attention greater than 35
        // */
        // //% block="R↗"
        // R_RUP = 8,/**
        // * Attention greater than 35
        // */
        // //% block="R↙"
        // R_LDOWN = 8,
        // /**
        // * Attention greater than 50
        // */
        // //% block="R↘"
        // R_RDOWN = 8,
    }



    export enum ButtonEventSrouse {
        /**
         * 35
         */
        //% block="⬆"
        Button_UP = 35,
        /**
         * 37
         */
        //% block="⬇"
        Button_DOWN = 37,
        /**
         * 38
         */
        //% block="⬅"
        Button_LEFT = 38,
        /**
        * 36
        */
        //% block="➡"
        Button_RIGHT = 36,
        /**
         * 43
         */
        //% block="▷"
        Button_Tri = 43,
        /**
         * 46
         */
        //% block="☐"
        Button_Squ = 46,
        /**
        * 44
        */
        //% block="𐤏"
        Button_Cir = 44,
        /**
         * 45
         */
        //% block="⨉"
        Button_X = 45,
        /**
         * 41
         */
        //% block=" left1"
        Button_Left1 = 41,
        /**
        * 42
        */
        //% block="right1"
        Button_Right1 = 42,
        /**
         * 39
         */
        //% block="left2"
        Button_Left2 = 39,
        /**
         * 40
         */
        //% block="right2"
        Button_Right2 = 40,
        /**
        * 31
        */
        //% block="select"
        Button_Sele = 31,
        /**
         * 34
         */
        //% block="start"
        Button_Star = 34,
        // /**
        //  * 32
        //  */
        // //% block="left3"
        // Button_L3 = 32,
        // /**
        //  * 33
        //  */
        // //% block="right3"
        // Button_R3 = 33,
    }

    export enum ButtonEventState {
        /**
         * Attention greater than 50
         */
        //% block="off"
        Button_off = 0,
        /**
         * Attention greater than 50
         */
        //% block="on"
        Button_on = 1,
    }


    export enum value_A {
        /**
         * Attention greater than 35
         */
        //% block="RX"
        RX = 25,
        /**
         * Attention greater than 50
         */
        //% block="RY"
        RY = 26,
        /**
         * Attention greater than 65
         */
        //% block="LX"
        LX = 27,
        /**
        * Attention greater than 35
        */
        //% block="LY"
        LY = 28,
        /**
         * 32
         */
        //% block="L3"
        Button_L3 = 32,
        /**
         * 33
         */
        //% block="R3"
        Button_R3 = 33,
    }

    export enum Vibration {
        /**
         * Attention greater than 50
         */
        //% block="off"
        Vibration_off = 30,
        /**
         * Attention greater than 50
         */
        //% block="on"
        Vibration_on = 29,
    }

    /**
    * Whether a Button is pressed
    */
    //% subcategory=Input group="IIC Port" color=#00B1ED
    //% block="Joystick button %value_level is pressed" blockId="DigitalButton"
    export function get_Attention_Value(level: value_level): boolean {
        let value = 0
        let digital = 0

        while (pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false) != 0x10);

        switch (level) {
            case value_level.UP:
                digital = value_level.UP
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.DOWN:
                digital = value_level.DOWN
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.LEFT:
                digital = value_level.LEFT
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.RIGHT:
                digital = value_level.RIGHT
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Tri:
                digital = value_level.Tri
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Squ:
                digital = value_level.Squ
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Cir:
                digital = value_level.Cir
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.X:
                digital = value_level.X
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Left1:
                digital = value_level.Left1
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Left2:
                digital = value_level.Left2
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Right1:
                digital = value_level.Right1
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Right2:
                digital = value_level.Right2
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Sele:
                digital = value_level.Sele
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.Star:
                digital = value_level.Star
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.L3:
                digital = value_level.L3
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            case value_level.R3:
                digital = value_level.R3
                pins.i2cWriteNumber(0x08, digital, NumberFormat.UInt8LE, false);
                value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (value == 1) {
                    return true
                }
                else if (value == 0) {
                    return false
                }
            default:
                return false
        }

    }

    /**
     * Get Analog value
    */
    //% subcategory=Input group="IIC Port" color=#00B1ED
    //% blockId="AnlogValue" block="Joystick rocker value of %value_A"
    export function GetAnalogValue(Button: value_A): number {
        let Analog = 0
        let re_value = 128

        while (pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false) != 0x10);

        switch (Button) {
            case value_A.RX:
                Analog = value_A.RX
                pins.i2cWriteNumber(0x08, Analog, NumberFormat.UInt8LE, false);
                re_value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (re_value != 128 && re_value != 0)
                    re_value = re_value + 1;
                break
            case value_A.RY:
                Analog = value_A.RY
                pins.i2cWriteNumber(0x08, Analog, NumberFormat.UInt8LE, false);
                re_value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (re_value != 0)
                    re_value = re_value + 1;
                break
            case value_A.LX:
                Analog = value_A.LX
                pins.i2cWriteNumber(0x08, Analog, NumberFormat.UInt8LE, false);
                re_value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (re_value != 128 && re_value != 0)
                    re_value = re_value + 1;
                break
            case value_A.LY:
                Analog = value_A.LY
                pins.i2cWriteNumber(0x08, Analog, NumberFormat.UInt8LE, false);
                re_value = pins.i2cReadNumber(0x08, NumberFormat.UInt8LE, false);
                if (re_value != 0)
                    re_value = re_value + 1;
                break
            default:
                re_value = 66
                break
        }

        re_value = re_value * 4;
        return re_value
    }

    let sc_byte = 0
    let dat = 0
    let low = 0
    let high = 0
    let temp = 0
    let temperature = 0
    let ack = 0
    let lastTemp = 0

    export enum ValType {
        //% block="temperature(℃)" enumval=0
        DS18B20_temperature_C,

        //% block="temperature(℉)" enumval=1
        DS18B20_temperature_F
    }
    function init_18b20(mpin: DigitalPin) {
        pins.digitalWritePin(mpin, 0)
        control.waitMicros(600)
        pins.digitalWritePin(mpin, 1)
        control.waitMicros(30)
        ack = pins.digitalReadPin(mpin)
        control.waitMicros(600)
        return ack
    }
    function write_18b20(mpin: DigitalPin, data: number) {
        sc_byte = 0x01
        for (let index = 0; index < 8; index++) {
            pins.digitalWritePin(mpin, 0)
            if (data & sc_byte) {
                pins.digitalWritePin(mpin, 1)
                control.waitMicros(60)
            } else {
                pins.digitalWritePin(mpin, 0)
                control.waitMicros(60)
            }
            pins.digitalWritePin(mpin, 1)
            data = data >> 1
        }
    }
    function read_18b20(mpin: DigitalPin) {
        dat = 0x00
        sc_byte = 0x01
        for (let index = 0; index < 8; index++) {
            pins.digitalWritePin(mpin, 0)
            pins.digitalWritePin(mpin, 1)
            if (pins.digitalReadPin(mpin)) {
                dat = dat + sc_byte
            }
            sc_byte = sc_byte << 1
            control.waitMicros(60)
        }
        return dat
    }

    //% subcategory=Sensor group="Digital" color=#EA5532
    //% block="value of DS18B20 %state at pin %Rjpin"
    export function Ds18b20Temp(Rjpin: DigitalRJPin, state: ValType): number {
        let pin = RJpin_to_digital(Rjpin);
        let temperature = celsius(pin);
        switch (state) {
            case ValType.DS18B20_temperature_C:
                return temperature
            case ValType.DS18B20_temperature_F:
                temperature = (temperature * 1.8) + 32
                return temperature
            default:
                return 0
        }

    }

    //% shim=dstemp::celsius
    //% parts=dstemp trackArgs=0
    function celsius(pin: DigitalPin): number {
        return 32.6;
    }

}
