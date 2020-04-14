/**
* Functions to Planet sensor(Stars) by ELECFREAKS Co.,Ltd.
*/
//% color=#191970  icon="\uf005" block="Stars" blockId="Stars_A"
//% groups='["Basic", "7-Seg 4-Dig LED Nixietube"]'
namespace Stars {
    ///////////////////////////// BME280 
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
    let TubeTab: number[] = [
        0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07,
        0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71
    ]
    ///////////////////////////////
    export enum DigitalRJPin {
        //% block="J1 (P1,P8)"
        J1,
        //% block="J2 (P2,P12)"
        J2,
        //% block="J3 (P13,P14)"
        J3,
        //% block="J4 (P15,P16)"
        J4
    }
    export enum AnalogRJPin {
        //% block="J1 (P1,P8)"
        J1,
        //% block="J2 (P2,P12)"
        J2
    }

    export enum Distance_Unit_List {
        //% block="cm" 
        Distance_Unit_cm,

        //% block="inch"
        Distance_Unit_inch,
    }
    export enum GeneralStateList {
        //% block="On"
        On,

        //% block="Off"
        Off
    }
    export enum ButtonStateList {
        //% block="A"
        A,
        //% block="B"
        B,
        //% block="AB"
        AB
    }
    export enum ADKeyList {
        //% block="A"
        A,
        //% block="B"
        B,
        //% block="C"
        C,
        //% block="D"
        D,
        //% block="E"
        E
    }
    export enum RelayStateList {
        //% block="NC|Close NO|Open"
        On,

        //% block="NC|Open NO|Close"
        Off
    }
    export enum BME280_state {
        //% block="temperature(℃)" enumval=0
        BME280_temperature_C,

        //% block="humidity(0~100)" enumval=1
        BME280_humidity,

        //% block="pressure(hPa)" enumval=2
        BME280_pressure,

        //% block="altitude(M)" enumval=3
        BME280_altitude,
    }
    export enum DHT11_state {
        //% block="temperature(℃)" enumval=0
        DHT11_temperature_C,

        //% block="temperature(℉)" enumval=1
        DHT11_temperature_F,

        //% block="humidity(0~100)" enumval=2
        DHT11_humidity,
    }
    /**
    *  Gestures
    */
    export enum gestureType {
        //% block=None
        None = 0,
        //% block=Right
        Right = 1,
        //% block=Left
        Left = 2,
        //% block=Up
        Up = 3,
        //% block=Down
        Down = 4,
        //% block=Forward
        Forward = 5,
        //% block=Backward
        Backward = 6,
        //% block=Clockwise
        Clockwise = 7,
        //% block=Anticlockwise
        Anticlockwise = 8,
        //% block=Wave
        Wave = 9
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
                    result = gestureType.Right;
                    break;

                case 0x02:
                    result = gestureType.Left;
                    break;

                case 0x04:
                    result = gestureType.Up;
                    break;

                case 0x08:
                    result = gestureType.Down;
                    break;

                case 0x10:
                    result = gestureType.Forward;
                    break;

                case 0x20:
                    result = gestureType.Backward;
                    break;

                case 0x40:
                    result = gestureType.Clockwise;
                    break;

                case 0x80:
                    result = gestureType.Anticlockwise;
                    break;

                default:
                    data = this.paj7620ReadReg(0x44);
                    if (data == 0x01)
                        result = gestureType.Wave;
                    break;
            }

            return result;
        }
    }


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
    function get(): void {
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

    /**********sensor************************星宿传感器************************************************ */
    /**
    * get Ultrasonic distance
    */
    //% blockId=sonarbit block="at pin %Rjpin Ultrasonic distance in unit %distance_unit "
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% distance_unit.fieldEditor="gridpicker"
    //% distance_unit.fieldOptions.columns=2
    //% subcategory=Sensor
    export function Ultrasoundsensor(Rjpin: DigitalRJPin, distance_unit: Distance_Unit_List): number {
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
                return Math.floor(distance / 254)   //inch
                break
            default:
                return 0
        }
    }
    /** 
    * TODO: get noise(dB)
    * @param noisepin describe parameter here, eg: AnalogRJPin.J1
    */
    //% blockId="readnoise" block="at pin %Rjpin Noise sensor volume(dB)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor
    export function NoiseSensor(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
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
    /**
    * TODO: get light intensity(0~100%)
    * @param lightintensitypin describe parameter here, eg: AnalogRJPin.J1
    */
    //% blockId="LightSensor" block="at pin %Rjpin light intensity(0~100)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor 
    export function LightSensor(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        let voltage = 0, lightintensity = 0;
        voltage = pins.map(
            pins.analogReadPin(pin),
            0,
            1023,
            0,
            100
        );
        lightintensity = voltage;
        return Math.round(lightintensity);
    }
    /**
    * TODO: get soil moisture(0~100%)
    * @param soilmoisturepin describe parameter here, eg: AnalogRJPin.J1
    */
    //% blockId="readsoilmoisture" block="at pin %Rjpin Soil moisture(0~100)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor 
    export function SoilHumidity(Rjpin: AnalogRJPin): number {
        let voltage = 0, soilmoisture = 0;
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        voltage = pins.map(
            pins.analogReadPin(pin),
            0,
            1023,
            0,
            100
        );
        soilmoisture = 100-voltage;
        return Math.round(soilmoisture);
    }
    /**
    * TODO: Detect soil moisture value(0~100%)
    * @param soilmoisturepin describe parameter here, eg: DigitalRJPin.J1
    */
    //% blockId="PIR" block="at pin %Rjpin PIR detects motion"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor 
    export function PIR(Rjpin: DigitalRJPin): boolean {
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
        if (pins.digitalReadPin(pin) == 1) {
            return true
        }
        else {
            return false
        }
    }
    /**
    * get water level value (0~100)
    * @param waterlevelpin describe parameter here, eg: AnalogRJPin.J1
    */
    //% blockId="readWaterLevel" block="at pin %Rjpin water level(0~100)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor 
    export function WaterLevel(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        let voltage = 0, waterlevel = 0;
        voltage = pins.map(
            pins.analogReadPin(pin),
            0,
            700,
            0,
            100
        );
        waterlevel = voltage;
        return Math.round(waterlevel)
    }

    /**
    * get UV level value (0~15)
    * @param waterlevelpin describe parameter here, eg: AnalogRJPin.J1
    */
    //% blockId="readUVLevel" block="at pin %Rjpin UV level(0~15)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Sensor 
    export function UVLevel(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        let UVlevel = 0;
        UVlevel = pins.map(
            pins.analogReadPin(pin),
            0,
            1023,
            0,
            15
        );
        return Math.round(UVlevel)
    }
    /**
    * get dht11 temperature and humidity Value
    * @param dht11pin describe parameter here, eg: DigitalPin.P15     */
    //% blockId="readdht11" block="at pin %Rjpin dht11 value of %dht11state"
    //% Rjpin.fieldEditor="gridpicker" dht11state.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2 dht11state.fieldOptions.columns=1
    //% subcategory=Sensor 
    export function temperature(Rjpin: DigitalRJPin, dht11state: DHT11_state): number {
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
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(pin)
        pins.setPull(pin, PinPullMode.PullUp);
        switch (dht11state) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(pin) == 1);
                while (pins.digitalReadPin(pin) == 0);
                while (pins.digitalReadPin(pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(pin) == 0);
                    dhtcounter1 = 0
                    while (pins.digitalReadPin(pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 2) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ff00) >> 8);
                break;
            case 1:
                while (pins.digitalReadPin(pin) == 1);
                while (pins.digitalReadPin(pin) == 0);
                while (pins.digitalReadPin(pin) == 1);
                let dhtvalue = 0;
                let dhtcounter = 0;
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(pin) == 0);
                    dhtcounter = 0
                    while (pins.digitalReadPin(pin) == 1) {
                        dhtcounter += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter > 2) {
                            dhtvalue = dhtvalue + (1 << (31 - i));
                        }
                    }
                }
                return Math.round((((dhtvalue & 0x0000ff00) >> 8) * 9 / 5) + 32);
                break;
            case 2:
                while (pins.digitalReadPin(pin) == 1);
                while (pins.digitalReadPin(pin) == 0);
                while (pins.digitalReadPin(pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(pin) == 0);
                    counter = 0
                    while (pins.digitalReadPin(pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 3) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
    }


    //% block="at pin IIC BME280 %state value"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=1
    //% subcategory=Sensor 
    export function octopus_BME280(state: BME280_state): number {
        switch (state) {
            case 0:
                get();
                return Math.round(T);
                break;
            case 1:
                get();
                return Math.round(H);
                break;
            case 2:
                get();
                return Math.round(P / 100);
                break;
            case 3:
                get();
                return Math.round(1015 - (P / 100)) * 9
                break;
            default:
                return 0
        }
        return 0;
    }
    const gestureEventId = 3100;
    let lastGesture = gestureType.None;
    let paj7620 = new PAJ7620();
    /**
        * Do something when a gesture is detected
        * @param gesture type of gesture to detect
        * @param handler code to run
    */
    //% blockId= gesture_create_event block="at pin IIC Gesture %gesture"
    //% gesture.fieldEditor="gridpicker" gesture.fieldOptions.columns=3
    //% subcategory=Sensor
    export function onGesture(gesture: gestureType, handler: () => void) {
        control.onEvent(gestureEventId, gesture, handler);
        if (!paj7620) {
            paj7620.init();
        }
        control.inBackground(() => {
            while (true) {
                const gesture = paj7620.read();
                if (gesture != lastGesture) {
                    lastGesture = gesture;
                    control.raiseEvent(gestureEventId, lastGesture);
                }
                basic.pause(50);
            }
        })
    }

    /**Input sensor*******************星宿传感器************************************* */


    /**
    * check crash
    */
    //% blockId=Crash block="at pin %Rjpin Crash Sensor is pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Input
    export function Crash(Rjpin: DigitalRJPin): boolean {
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
        if (pins.digitalReadPin(pin) == 0) {
            return true
        }
        else {
            return false
        }
    }

    //% blockId="potentiometer" block="at pin %Rjpin potentiometer value"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Input
    export function potentiometer(Rjpin: AnalogRJPin): number {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        return pins.analogReadPin(pin)
    }
    //% blockId=buttonab block="at pin %Rjpin Button %button is pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=1
    //% subcategory=Input
    export function buttonAB(Rjpin: DigitalRJPin, button: ButtonStateList): boolean {
        let pinA = DigitalPin.P1
        let pinB = DigitalPin.P2
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pinA = DigitalPin.P1
                pinB = DigitalPin.P8
                break;
            case DigitalRJPin.J2:
                pinA = DigitalPin.P2
                pinB = DigitalPin.P12
                break;
            case DigitalRJPin.J3:
                pinA = DigitalPin.P13
                pinB = DigitalPin.P14
                break;
            case DigitalRJPin.J4:
                pinA = DigitalPin.P15
                pinB = DigitalPin.P16
                break;
        }
        if (pins.digitalReadPin(pinB) == 0 && pins.digitalReadPin(pinA) == 0 && button == ButtonStateList.AB)
        {
            return true
        }
        else
        {
            if (pins.digitalReadPin(pinA) == 0 && button == ButtonStateList.A) {
                return true
            }
            else if (pins.digitalReadPin(pinB) == 0 && button == ButtonStateList.B) {
                return true
            }        
            else
            {
                return false
            }
        }

    }


    /**Output sensor*******************星宿传感器************************************* */

    /**
    * toggle led
    */
    //% blockId=LED block="at pin %Rjpin LED toggle to %ledstate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% ledstate.fieldEditor="gridpicker"
    //% ledstate.fieldOptions.columns=2
    //% subcategory=Output group="Basic"
    export function LED(Rjpin: DigitalRJPin, ledstate: GeneralStateList): void {
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
        switch (ledstate) {
            case GeneralStateList.On:
                pins.digitalWritePin(pin, 1)
                break;
            case GeneralStateList.Off:
                pins.digitalWritePin(pin, 0)
                break;
        }
    }
    /**
    * toggle laserSensor
    */
    //% blockId=laserSensor block="at pin %Rjpin laser toggle to %laserstate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% laserstate.fieldEditor="gridpicker"
    //% laserstate.fieldOptions.columns=2
    //% subcategory=Output group="Basic"
    export function laserSensor(Rjpin: DigitalRJPin, laserstate: GeneralStateList): void {
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
        switch (laserstate) {
            case GeneralStateList.On:
                pins.digitalWritePin(pin, 1)
                break;
            case GeneralStateList.Off:
                pins.digitalWritePin(pin, 0)
                break;
        }
    }
    /**
    * toggle fans
    */
    //% blockId=fans block="at pin %Rjpin fans set power to %speed \\%"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% subcategory=Output group="Basic"
    //% speed.min=0 speed.max=100
    export function fans(Rjpin: AnalogRJPin, speed: number): void {
        let pin = AnalogPin.P1
        switch (Rjpin) {
            case AnalogRJPin.J1:
                pin = AnalogPin.P1
                break;
            case AnalogRJPin.J2:
                pin = AnalogPin.P2
                break;
        }
        pins.servoSetPulse(pin, speed * 10)

    }
    /**
    * toggle Relay
    */
    //% blockId=Relay block="at pin %Rjpin Relay toggle to %Relaystate"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% Relaystate.fieldEditor="gridpicker"
    //% Relaystate.fieldOptions.columns=1
    //% subcategory=Output group="Basic"
    export function Relay(Rjpin: DigitalRJPin, Relaystate: RelayStateList): void {
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
        switch (Relaystate) {
            case RelayStateList.On:
                pins.digitalWritePin(pin, 0)
                break;
            case RelayStateList.Off:
                pins.digitalWritePin(pin, 1)
                break;
        }
    }
    /**
     * Create a new driver Grove - 4-Digit Display
     * @param clkPin value of clk pin number
     * @param dataPin value of data pin number
     */
    //% blockId=grove_tm1637_create block="connect 4-Digit Display |pin %pin|"
    //% subcategory=Output group="7-Seg 4-Dig LED Nixietube" blockSetVariable=display
    //% weight = 1
    export function createDisplay(Rjpin: DigitalRJPin): TM1637 {
        let display = new TM1637()
        switch (Rjpin) {
            case 1:
                display.clkPin = DigitalPin.P8
                display.dataPin = DigitalPin.P1
                break;
            case 2:
                display.clkPin = DigitalPin.P12
                display.dataPin = DigitalPin.P2
                break;
            case 3:
                display.clkPin = DigitalPin.P14
                display.dataPin = DigitalPin.P13
                break;
            case 4:
                display.clkPin = DigitalPin.P16
                display.dataPin = DigitalPin.P15
                break;
        }
        display.buf = pins.createBuffer(4)
        display.brightnessLevel = 7
        display.pointFlag = false
        display.clear()

        return display
    }
    export class TM1637 {
        clkPin: DigitalPin
        dataPin: DigitalPin
        brightnessLevel: number
        pointFlag: boolean
        buf: Buffer

        private writeByte(wrData: number) {
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.clkPin, 0)
                if (wrData & 0x01) pins.digitalWritePin(this.dataPin, 1)
                else pins.digitalWritePin(this.dataPin, 0)
                wrData >>= 1
                pins.digitalWritePin(this.clkPin, 1)
            }

            pins.digitalWritePin(this.clkPin, 0) // Wait for ACK
            pins.digitalWritePin(this.dataPin, 1)
            pins.digitalWritePin(this.clkPin, 1)
        }

        private start() {
            pins.digitalWritePin(this.clkPin, 1)
            pins.digitalWritePin(this.dataPin, 1)
            pins.digitalWritePin(this.dataPin, 0)
            pins.digitalWritePin(this.clkPin, 0)
        }

        private stop() {
            pins.digitalWritePin(this.clkPin, 0)
            pins.digitalWritePin(this.dataPin, 0)
            pins.digitalWritePin(this.clkPin, 1)
            pins.digitalWritePin(this.dataPin, 1)
        }

        private coding(dispData: number): number {
            let pointData = 0

            if (dispData == 0x7f) dispData = 0x00
            else if (dispData == 0x3f) dispData = 0x3f
            else dispData = TubeTab[dispData] + pointData

            return dispData
        }

        /**
         * Show a 4 digits number on display
         * @param dispData value of number
         */
        //% blockId=grove_tm1637_display_number block="%display|show number|%dispData"
        //% subcategory=Output group="7-Seg 4-Dig LED Nixietube"
        show(dispData: number, fillWithZeros = false) {
            let def = 0x7f
            if (fillWithZeros)
                def = 0x3f
            if (dispData < 10) {
                this.bit(dispData, 3)
                this.bit(def, 2)
                this.bit(def, 1)
                this.bit(def, 0)

                this.buf[3] = dispData
                this.buf[2] = def
                this.buf[1] = def
                this.buf[0] = def
            }
            else if (dispData < 100) {
                this.bit(dispData % 10, 3)
                this.bit((dispData / 10) % 10, 2)
                this.bit(def, 1)
                this.bit(def, 0)

                this.buf[3] = dispData % 10
                this.buf[2] = (dispData / 10) % 10
                this.buf[1] = def
                this.buf[0] = def
            }
            else if (dispData < 1000) {
                this.bit(dispData % 10, 3)
                this.bit((dispData / 10) % 10, 2)
                this.bit((dispData / 100) % 10, 1)
                this.bit(def, 0)

                this.buf[3] = dispData % 10
                this.buf[2] = (dispData / 10) % 10
                this.buf[1] = (dispData / 100) % 10
                this.buf[0] = def
            }
            else {
                this.bit(dispData % 10, 3)
                this.bit((dispData / 10) % 10, 2)
                this.bit((dispData / 100) % 10, 1)
                this.bit((dispData / 1000) % 10, 0)

                this.buf[3] = dispData % 10
                this.buf[2] = (dispData / 10) % 10
                this.buf[1] = (dispData / 100) % 10
                this.buf[0] = (dispData / 1000) % 10
            }
        }

        /**
         * Set the brightness level of display at from 0 to 7
         * @param level value of brightness level
         */
        //% blockId=grove_tm1637_set_display_level block="%display|brightness level to|%level"
        //% level.min=0 level.max=7
        //% subcategory=Output group="7-Seg 4-Dig LED Nixietube"
        set(level: number) {
            this.brightnessLevel = level

            this.bit(this.buf[0], 0x00)
            this.bit(this.buf[1], 0x01)
            this.bit(this.buf[2], 0x02)
            this.bit(this.buf[3], 0x03)
        }

        /**
         * Show a single number from 0 to 9 at a specified digit of Grove - 4-Digit Display
         * @param dispData value of number
         * @param bitAddr value of bit number
         */
        //% blockId=grove_tm1637_display_bit block="%display|show single number|%dispData|at digit|%bitAddr"
        //% dispData.min=0 dispData.max=9
        //% bitAddr.min=0 bitAddr.max=3
        //% subcategory=Output group="7-Seg 4-Dig LED Nixietube"
        bit(dispData: number, bitAddr: number) {
            if ((dispData == 0x7f) || (dispData == 0x3f) || ((dispData <= 9) && (bitAddr <= 3))) {
                let segData = 0

                if (bitAddr == 1 && this.pointFlag)
                    segData = this.coding(dispData) + 0x80
                else
                    segData = this.coding(dispData)
                this.start()
                this.writeByte(0x44)
                this.stop()
                this.start()
                this.writeByte(bitAddr | 0xc0)
                this.writeByte(segData)
                this.stop()
                this.start()
                this.writeByte(0x88 + this.brightnessLevel)
                this.stop()

                this.buf[bitAddr] = dispData
            }
        }

        /**
         * Turn on or off the colon point on Grove - 4-Digit Display
         * @param pointEn value of point switch
         */
        //% blockId=grove_tm1637_display_point block="%display|turn|%point|colon point"
        //% subcategory=Output group="7-Seg 4-Dig LED Nixietube"
        point(b: boolean) {

            this.pointFlag = b
            this.bit(this.buf[1], 0x01)
        }

        /**
         * Clear the display
         */
        //% blockId=grove_tm1637_display_clear block="%display|clear"
        //% subcategory=Output group="7-Seg 4-Dig LED Nixietube"
        clear() {
            this.bit(0x7f, 0x00)
            this.bit(0x7f, 0x01)
            this.bit(0x7f, 0x02)
            this.bit(0x7f, 0x03)
        }
    }
}
