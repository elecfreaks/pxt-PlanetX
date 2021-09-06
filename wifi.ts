//% color=#4ca630 icon="\uf1eb" 
//% block="PlanetX_IoT" blockId="PlanetX_IoT"
namespace PlanetX_IOT {
    let CMD = 0
    let wifi_connected: boolean = false
    let thingspeak_connected: boolean = false
    let kidsiot_connected: boolean = false
    let MQTTbroker_connected: boolean = false
    let userToken_def: string = ""
    let topic_def: string = ""
    type mess = (t: string, s: string) => void
    let mqttEvt: mess = null
    let mqttlist = [];
    let mqtthost_def = "ELECFREAKS"
    let iftttkey_def = ""
    let iftttevent_def = ""
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
    export enum stateList {
        //% block="on"
        on = 14,
        //% block="off"
        off = 15
    }
    let TStoSendStr = ""
    serial.onDataReceived("\n", function () {
        let serial_str = serial.readString()
        if (serial_str.includes("WIFI GOT IP")) {
            if (CMD == 0x01) {
                wifi_connected = true
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 1)
            }
        }
        else if (serial_str.includes("MQTTSUBRECV")) {
            basic.showNumber(1)
            mqttlist = serial_str.split(",", 4)
            mqttEvt(mqttlist[1].slice(1, mqttlist[1].length - 1), mqttlist[3])
        }
        else if (serial_str.includes("ERROR")) {
            if (CMD == 0x01) {
                wifi_connected = false
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 1)
            }
            else if (CMD == 0x02) {
                thingspeak_connected = false
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 2)
            }
            else if (CMD == 0x04) {
                kidsiot_connected = false
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 4)
            }
            else if (CMD == 0x06) {
                MQTTbroker_connected = false
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 6)
            }
            else if (CMD == 0x07) {
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 7)
            }
        }
        else if (serial_str.includes(mqtthost_def)) {
            MQTTbroker_connected = true
            control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 6)
        }
        else if (serial_str.includes("CONNECT")) {
            if (CMD == 0x02) {
                thingspeak_connected = true
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 2)
            }
            else if (CMD == 0x04) {
                control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 4)
            }
        }
        else if (serial_str.includes("Congratu")) {
            control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 7)
        }
        else if (serial_str.includes("bytes")) {
            kidsiot_connected = true
            control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 5)
        }
        else if (serial_str.includes("switchoff")) {
            control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 15)
        }
        else if (serial_str.includes("switchon")) {
            control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 14)
        }

        else if (serial_str.includes("WIFI DISCONNECT")) {
            wifi_connected = false
        }
    })

    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 0) {
        serial.writeString(command + "\u000D\u000A")
        basic.pause(wait)
    }

    /**
    * Initialize ESP8266 module 
    */
    //% block="set ESP8266 %Rjpin Baud rate %baudrate"
    //% ssid.defl=your_ssid
    //% pw.defl=your_password weight=100
    export function initWIFI(Rjpin: DigitalRJPin, baudrate: BaudRate) {
        let pin_tx = SerialPin.P1
        let pin_rx = SerialPin.P8
        switch (Rjpin) {
            case DigitalRJPin.J1:
                pin_tx = SerialPin.P8
                pin_rx = SerialPin.P1
                break;
            case DigitalRJPin.J2:
                pin_tx = SerialPin.P12
                pin_rx = SerialPin.P2
                break;
            case DigitalRJPin.J3:
                pin_tx = SerialPin.P14
                pin_rx = SerialPin.P13
                break;
            case DigitalRJPin.J4:
                pin_tx = SerialPin.P16
                pin_rx = SerialPin.P15
                break;
        }
        serial.redirect(
            pin_tx,
            pin_rx,
            baudrate
        )
        sendAT("AT+RESTORE", 1000) // restore to factory settings
        sendAT("ATE0") // disable echo
        sendAT("AT+CWMODE=1") // set to STA mode
        basic.pause(100)
    }
    /**
    * connect to Wifi router
    */
    //% block="connect Wifi SSID = %ssid|KEY = %pw"
    //% ssid.defl=your_ssid
    //% pw.defl=your_pw weight=95
    export function connectWifi(ssid: string, pw: string) {
        CMD = 0x01
        sendAT("AT+CWJAP=\"" + ssid + "\",\"" + pw + "\"", 1000) // connect to Wifi router
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 1)
    }
    /**
    * Check if ESP8266 successfully connected to Wifi
    */
    //% block="Wifi connected %State" weight=70
    export function wifiState(state: boolean) {
        return wifi_connected == state
    }
    /**
    * Connect to ThingSpeak
    */
    //% block="connect thingspeak"
    //% write_api_key.defl=your_write_api_key
    //% subcategory="ThingSpeak" weight=90
    export function connectThingSpeak() {
        CMD = 0x02
        let text = "AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80"
        sendAT(text, 0) // connect to website server
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 2)
    }
    /**
    * Connect to ThingSpeak and set data. 
    */
    //% block="set data to send ThingSpeak | Write API key = %write_api_key|Field 1 = %n1||Field 2 = %n2|Field 3 = %n3|Field 4 = %n4|Field 5 = %n5|Field 6 = %n6|Field 7 = %n7|Field 8 = %n8"
    //% write_api_key.defl=your_write_api_key
    //% expandableArgumentMode="enabled"
    //% subcategory="ThingSpeak" weight=85
    export function setData(write_api_key: string, n1: number = 0, n2: number = 0, n3: number = 0, n4: number = 0, n5: number = 0, n6: number = 0, n7: number = 0, n8: number = 0) {
        TStoSendStr = "GET /update?api_key="
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
    /**
    * upload data. It would not upload anything if it failed to connect to Wifi or ThingSpeak.
    */
    //% block="Upload data to ThingSpeak"
    //% subcategory="ThingSpeak" weight=80
    export function uploadData() {
        sendAT("AT+CIPSEND=" + (TStoSendStr.length + 2), 300)
        sendAT(TStoSendStr, 300) // upload data
    }

    /**
    * Check if ESP8266 successfully connected to ThingSpeak
    */
    //% block="ThingSpeak connected %State"
    //% subcategory="ThingSpeak" weight=65
    export function thingSpeakState(state: boolean) {
        return thingspeak_connected == state
    }
    /*-----------------------------------kidsiot---------------------------------*/
    /**
    * Connect to kidsiot
    */
    //% subcategory=KidsIot weight=50
    //% blockId=initkidiot block="Connect KidsIot with userToken: %userToken Topic: %topic"
    export function connectKidsiot(userToken: string, topic: string): void {
        userToken_def = userToken
        topic_def = topic
        CMD = 0x04
        sendAT("AT+CIPSTART=\"TCP\",\"139.159.161.57\",5555", 0) // connect to website server
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 4)
        let jsonText = "{\"topic\":\"" + topic + "\",\"userToken\":\"" + userToken + "\",\"op\":\"init\"}"
        sendAT("AT+CIPSEND=" + (jsonText.length + 2), 300)
        sendAT(jsonText, 0)
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 5)
    }
    /**
    * upload data to kidsiot
    */
    //% subcategory=KidsIot weight=45
    //% blockId=uploadkidsiot block="Upload data %data to kidsiot"
    export function uploadKidsiot(data: number): void {
        if (kidsiot_connected) {
            data = Math.floor(data)
            let jsonText = "{\"topic\":\"" + topic_def + "\",\"userToken\":\"" + userToken_def + "\",\"op\":\"up\",\"data\":\"" + data + "\"}"
            sendAT("AT+CIPSEND=" + (jsonText.length + 2), 300)
            sendAT(jsonText, 0)
        }
    }
    /**
    * disconnect from kidsiot
    */
    //% subcategory=KidsIot weight=40
    //% blockId=Disconnect block="Disconnect with kidsiot"
    export function disconnectKidsiot(): void {
        if (kidsiot_connected) {
            let text_one = "{\"topic\":\"" + topic_def + "\",\"userToken\":\"" + userToken_def + "\",\"op\":\"close\"}"
            sendAT("AT+CIPSEND=" + (text_one.length + 2), 300)
            sendAT(text_one, 0)
        }
    }
    /**
    * Check if ESP8266 successfully connected to KidsIot
    */
    //% block="KidsIot connection %State"
    //% subcategory="KidsIot" weight=35
    export function kidsiotState(state: boolean) {
        return kidsiot_connected == state
    }
    //% block="When switch %vocabulary"
    //% subcategory="KidsIot" weight=30
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function iotSwitchEvent(state: stateList, handler: () => void) {
        control.onEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, state, handler)
    }
    /*----------------------------------MQTT-----------------------*/
    /**
    * Set  MQTT client
    */
    //% subcategory=MQTT weight=30 
    //% blockId=initMQTT block="Set MQTT client config|scheme: %scheme clientID: %clientID username: %username password: %password path: %path"
    export function setMQTT(scheme: number, clientID: string, username: string, password: string, path: string): void {
        sendAT("AT+MQTTUSERCFG=0," + scheme + ",\"" + clientID + "\",\"" + username + "\",\"" + password + "\"," + 0 + "," + 0 + ",\"" + path + "\"", 1000) // connect to website server
    }
    /**
    * Connect to MQTT broker
    */
    //% subcategory=MQTT weight=25
    //% blockId=connectMQTT block="connect MQTT broker host: %host port: %port reconnect: $reconnect"
    export function connectMQTT(host: string, port: number, reconnect: boolean): void {
        CMD = 0x06
        mqtthost_def = host
        let rec = 1
        if (reconnect) {
            rec = 0
        }
        sendAT("AT+MQTTCONN=0,\"" + host + "\"," + port + "," + rec, 5000) // connect to website server
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 6)
    }
    /**
    * Check if ESP8266 successfully connected to mqtt broker
    */
    //% block="MQTT broker connection %State"
    //% subcategory="MQTT" weight=24
    export function brokerState(state: boolean) {
        return MQTTbroker_connected == state
    }
    /**
    * send message 
    */
    //% subcategory=MQTT weight=21
    //% blockId=sendMQTT block="send %mes to $topic=variables_get(topic) Qos %qos"
    export function sendmesMQTT(mes: string, topic: string, qos: number): void {
        sendAT("AT+MQTTPUB=0,\"" + topic + "\",\"" + mes + "\"," + qos + ",0", 1000) // connect to website server
    }
    /**
    * subscribe 
    */
    //% subcategory=MQTT weight=20
    //% blockId=subMQTT block="subscribe $topic=variables_get(topic) with Qos: %qos"
    export function subMQTT(topic: string, qos: number): void {
        sendAT("AT+MQTTSUB=0,\"" + topic + "\"," + qos, 1000) // connect to website server
    }
    /**
    * unsubscribe 
    */
    //% subcategory=MQTT weight=19
    //% blockId=unsubMQTT block="unsubscribe $topic=variables_get(topic)"
    export function unsubMQTT(topic: string): void {
        sendAT("AT+MQTTUNSUB=0,\"" + topic + "\"", 1000) // connect to website server
    }

    /**
    * send message 
    */
    //% subcategory=MQTT weight=15
    //% blockId=breakMQTT block="Disconnect from broker"
    export function breakMQTT(): void {
        sendAT("AT+MQTTCLEAN=0", 1000) // connect to website server
    }

    //% block="When $topic have new $message"
    //% subcategory=MQTT weight=10
    //% draggableParameters
    export function MqttEvent(handler: (topic: string, message: string) => void) {
        mqttEvt = handler
    }
    //////////----------------------------------- IFTTT--------------------------------/////////
    /**
    * set ifttt
    */
    //% subcategory=IFTTT weight=9
    //% blockId=setIFTTT block="set IFTTT key:%key event:%event"
    export function setIFTTT(key: string, event: string): void {
        iftttkey_def = key
        iftttevent_def = event
    }
    /**
    * post ifttt
    */
    //% subcategory=IFTTT weight=8
    //% blockId=postIFTTT block="post IFTTT with|value1:%value value2:%value2 value3:%value3"
    export function postIFTTT(value1: string, value2: string, value3: string): void {
        let sendST1 = "AT+HTTPCLIENT=3,1,\"http://maker.ifttt.com/trigger/" + iftttevent_def + "/with/key/" + iftttkey_def + "\",,,2,"
        let sendST2 = "\"{\\\"value1\\\":\\\"" + value1 + "\\\"\\\,\\\"value2\\\":\\\"" + value2 + "\\\"\\\,\\\"value3\\\":\\\"" + value3 + "\\\"}\""
        let sendST = sendST1 + sendST2
        sendAT(sendST, 1000)
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 7)
    }

}