//% color=#4ca630 icon="\uf1eb"
//% block="PlanetX_IoT" blockId="PlanetX_IoT"
namespace ESP8266_IoT {
    let wifi_connected: boolean = false
    let thingspeak_connected: boolean = false
    let kitsiot_connected: boolean = false
    let last_upload_successful: boolean = false
    let userToken_def: string = ""
    let topic_def: string = ""
    let recevice_kidiot_text = ""
    const EVENT_ON_ID = 100
    const EVENT_ON_Value = 200
    const EVENT_OFF_ID = 110
    const EVENT_OFF_Value = 210
    let toSendStr = ""

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

    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 0) {
        serial.writeString(command + "\u000D\u000A")
        basic.pause(wait)
    }

    // wait for certain response from ESP8266
    function waitResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        while (true) {
            serial_str += serial.readString()
            if (serial_str.length > 200)
                serial_str = serial_str.substr(serial_str.length - 200)
            if (serial_str.includes("OK") || serial_str.includes("ALREADY CONNECTED") || serial_str.includes("WIFI GOT IP") || serial_str.includes("CONNECT")) {
                result = true
                break
            }
            if (serial_str.includes("ERROR") || serial_str.includes("FAIL")) {
                break
            }
            if (input.runningTime() - time > 5000) {
                break
            }
        }
        return result
    }
    /**
    * Initialize ESP8266 module 
    */
    //% block="set ESP8266 %Rjpin Baud rate %baudrate"
    //% ssid.defl=your_ssid
    //% pw.defl=your_password
    export function initWIFI(Rjpin: DigitalRJPin, baudrate: BaudRate) {
        let pin_tx = SerialPin.P1
        let pin_rx = SerialPin.P8
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pin_tx = SerialPin.P1
                pin_rx = SerialPin.P8
                break;
            case DigitalRJPin.J2:
                pin_tx = SerialPin.P2
                pin_rx = SerialPin.P12
                break;
            case DigitalRJPin.J3:
                pin_tx = SerialPin.P13
                pin_rx = SerialPin.P14
                break;
            case DigitalRJPin.J4:
                pin_tx = SerialPin.P15
                pin_rx = SerialPin.P16
                break;
        }
        serial.redirect(
            pin_tx,
            pin_rx,
            baudrate
        )
        sendAT("AT+RESTORE", 1000) // restore to factory settings
        sendAT("AT+CWMODE=1") // set to STA mode
        sendAT("AT+RST", 1000) // reset
        basic.pause(100)
    }
    /**
    * connect to Wifi router
    */
    //% block="connect Wifi SSID = %ssid|KEY = %pw"
    //% ssid.defl=your_ssid
    //% pw.defl=your_pw
    export function connectWifi(ssid: string, pw: string) {
        wifi_connected = false
        thingspeak_connected = false
        kitsiot_connected = false
        sendAT("AT+CWJAP=\"" + ssid + "\",\"" + pw + "\"", 0) // connect to Wifi router
        wifi_connected = waitResponse()
        basic.pause(100)
    }
    /**
    * Connect to ThingSpeak
    */
    //% block="connect thingspeak"
    //% write_api_key.defl=your_write_api_key
    //% subcategory="ThingSpeak"
    export function connectThingSpeak() {
        if (wifi_connected && kitsiot_connected == false) {
            thingspeak_connected = false
            let text = "AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80"
            sendAT(text, 0) // connect to website server
            thingspeak_connected = waitResponse()
            basic.pause(100)
        }
    }
    /**
    * Connect to ThingSpeak and set data. 
    */
    //% block="set data to send ThingSpeak | Write API key = %write_api_key|Field 1 = %n1||Field 2 = %n2|Field 3 = %n3|Field 4 = %n4|Field 5 = %n5|Field 6 = %n6|Field 7 = %n7|Field 8 = %n8"
    //% write_api_key.defl=your_write_api_key
    //% expandableArgumentMode="enabled"
    //% subcategory="ThingSpeak"
    export function setData(write_api_key: string, n1: number = 0, n2: number = 0, n3: number = 0, n4: number = 0, n5: number = 0, n6: number = 0, n7: number = 0, n8: number = 0) {
        if (thingspeak_connected) {
            toSendStr = "GET /update?api_key="
                + write_api_key
                + "&field1="
                + n1
                + "&field2="
                + n2
                + "&field3="
                + n3
                + "&field4="
                + n4
                + "&field5="
                + n5
                + "&field6="
                + n6
                + "&field7="
                + n7
                + "&field8="
                + n8
        }
    }
    /**
    * upload data. It would not upload anything if it failed to connect to Wifi or ThingSpeak.
    */
    //% block="Upload data to ThingSpeak"
    //% subcategory="ThingSpeak"
    export function uploadData() {
        if (thingspeak_connected) {
            last_upload_successful = false
            sendAT("AT+CIPSEND=" + (toSendStr.length + 2), 100)
            sendAT(toSendStr, 100) // upload data
            last_upload_successful = waitResponse()
            basic.pause(100)
        }
    }

    /**
    * Wait between uploads
    */
    //% block="Wait %delay ms"
    //% delay.min=0 delay.defl=5000
    export function wait(delay: number) {
        if (delay > 0) basic.pause(delay)
    }

    /**
    * Check if ESP8266 successfully connected to Wifi
    */
    //% block="Wifi connected %State"
    export function wifiState(state: boolean) {
        if (wifi_connected == state) {
            return true
        }
        else {
            return false
        }
    }

    /**
    * Check if ESP8266 successfully connected to ThingSpeak
    */
    //% block="ThingSpeak connected %State"
    //% subcategory="ThingSpeak"
    export function thingSpeakState(state: boolean) {
        if (thingspeak_connected == state) {
            return true
        }
        else {
            return false
        }
    }


    /**
    * Check if ESP8266 successfully uploaded data to ThingSpeak
    */
    //% block="ThingSpeak Last data upload %State"
    //% subcategory="ThingSpeak"
    export function tsLastUploadState(state: boolean) {
        if (last_upload_successful == state) {
            return true
        }
        else {
            return false
        }
    }
    /*-----------------------------------kitsiot---------------------------------*/
    /**
    * Connect to kitsiot
    */
    //% subcategory=KidsIot
    //% blockId=initkitiot block="Connect KidsIot with userToken: %userToken Topic: %topic"
    export function connectKidsiot(userToken: string, topic: string): void {
        if (wifi_connected && thingspeak_connected == false) {
            userToken_def = userToken
            topic_def = topic
            sendAT("AT+CIPSTART=\"TCP\",\"139.159.161.57\",5555", 0) // connect to website server
            let text_one = "{\"topic\":\"" + topic + "\",\"userToken\":\"" + userToken + "\",\"op\":\"init\"}"
            sendAT("AT+CIPSEND=" + (text_one.length + 2), 0)
            sendAT(text_one, 0)
            kitsiot_connected = waitResponse()
        }
    }
    /**
    * upload data to kitsiot
    */
    //% subcategory=KidsIot
    //% blockId=uploadkitsiot block="Upload data %data to kidsiot"
    export function uploadKidsiot(data: number): void {
        if (kitsiot_connected) {
            data = Math.floor(data)
            let text_one = "{\"topic\":\"" + topic_def + "\",\"userToken\":\"" + userToken_def + "\",\"op\":\"up\",\"data\":\"" + data + "\"}"
            sendAT("AT+CIPSEND=" + (text_one.length + 2), 0)
            sendAT(text_one, 0)
        }
    }
    /**
    * disconnect from kitsiot
    */
    //% subcategory=KidsIot
    //% blockId=Disconnect block="Disconnect with kidsiot"
    export function disconnectKidsiot(): void {
        if (kitsiot_connected) {
            let text_one = "{\"topic\":\"" + topic_def + "\",\"userToken\":\"" + userToken_def + "\",\"op\":\"close\"}"
            sendAT("AT+CIPSEND=" + (text_one.length + 2), 0)
            sendAT(text_one, 0)
            kitsiot_connected = !waitResponse()
        }
    }
    /**
    * Check if ESP8266 successfully connected to KidsIot
    */
    //% block="KidsIot connection %State"
    //% subcategory="KidsIot"
    export function kidsiotState(state: boolean) {
        if (kitsiot_connected == state) {
            return true
        }
        else {
            return false
        }
    }
    /**
* recevice value from kidsiot
*/
    //% block="When switch on"
    //% subcategory=KidsIot
    export function iotSwitchon(handler: () => void) {
        recevice_kitiot()
        control.onEvent(EVENT_ON_ID, EVENT_ON_Value, handler)
    }
    /**
     * recevice value from kidsiot
     */
    //% block="When switch off"
    //% subcategory=KidsIot
    export function iotSwitchoff(handler: () => void) {
        recevice_kitiot()
        control.onEvent(EVENT_OFF_ID, EVENT_OFF_Value, handler)
    }

    export function recevice_kitiot() {
        control.inBackground(function () {
            while (kidsiotState) {
                recevice_kidiot_text = serial.readLine()
                recevice_kidiot_text += serial.readString()
                if (recevice_kidiot_text.includes("CLOSED")) {
                    recevice_kidiot_text = ""
                    kitsiot_connected = false
                }
                if (recevice_kidiot_text.includes("switchon")) {
                    recevice_kidiot_text = ""
                    control.raiseEvent(EVENT_ON_ID, EVENT_ON_Value, EventCreationMode.CreateAndFire)
                }
                if (recevice_kidiot_text.includes("switchof")) {
                    recevice_kidiot_text = ""
                    control.raiseEvent(EVENT_OFF_ID, EVENT_OFF_Value, EventCreationMode.CreateAndFire)
                }
                basic.pause(20)
            }
        })
    }
}