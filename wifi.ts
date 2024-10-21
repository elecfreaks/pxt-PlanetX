//% color=#4ca630 icon="\uf1eb" 
//% block="PlanetX_IoT" blockId="PlanetX_IoT"
namespace PlanetX_IOT {
    enum Cmd {
        None,
        ConnectWifi,
        ConnectThingSpeak,
        ConnectSmartIot,
        InitSmartIot,
        UploadSmartIot,
        DisconnectSmartIot,
        ConnectMqtt,
    }

    export enum SmartIotSwitchState {
        //% block="on"
        on = 1,
        //% block="off"
        off = 2
    }

    export enum SchemeList {
        //% block="TCP"
        TCP = 1,
        //% block="TLS"
        TLS = 2
    }

    export enum QosList {
        //% block="0"
        Qos0 = 0,
        //% block="1"
        Qos1,
        //% block="2"
        Qos2
    }

    let wifi_connected: boolean = false
    let thingspeak_connected: boolean = false
    let smartiot_connected: boolean = false
    let mqttBrokerConnected: boolean = false
    let userToken_def: string = ""
    let topic_def: string = ""
    const mqttSubscribeHandlers: { [topic: string]: (message: string) => void } = {}
    const mqttSubscribeQos: { [topic: string]: number } = {}
    let mqtthost_def = "ELECFREAKS"
    let iftttkey_def = ""
    let iftttevent_def = ""

    let recvString = ""
    let currentCmd: Cmd = Cmd.None

    const THINGSPEAK_HOST = "api.thingspeak.com"
    const THINGSPEAK_PORT = "80"
    const SMARTIOT_HOST = "47.239.108.37"
    const SMARTIOT_PORT = "8081"

    const EspEventSource = 3000
    const EspEventValue = {
        None: Cmd.None,
        ConnectWifi: Cmd.ConnectWifi,
        ConnectThingSpeak: Cmd.ConnectThingSpeak,
        ConnectSmartIot: Cmd.ConnectSmartIot,
        InitSmartIot: Cmd.InitSmartIot,
        UploadSmartIot: Cmd.UploadSmartIot,
        DisconnectSmartIot: Cmd.DisconnectSmartIot,
        ConnectMqtt: Cmd.ConnectMqtt,
        PostIFTTT: 255
    }
    const SmartIotEventSource = 3100
    const SmartIotEventValue = {
        switchOn: SmartIotSwitchState.on,
        switchOff: SmartIotSwitchState.off
    }

    let TStoSendStr = ""

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

    /**
     * on serial received data
     */
    serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
        recvString += serial.readString()
        pause(1)

        // received smart iot data
        if (recvString.includes("switchoff")) {
            recvString = ""
            control.raiseEvent(SmartIotEventSource, SmartIotEventValue.switchOff)
        } else if (recvString.includes("switchon")) {
            recvString = ""
            control.raiseEvent(SmartIotEventSource, SmartIotEventValue.switchOn)
        }

        if (recvString.includes("MQTTSUBRECV")) {
            recvString = recvString.slice(recvString.indexOf("MQTTSUBRECV"))
            const recvStringSplit = recvString.split(",", 4)
            const topic = recvStringSplit[1].slice(1, -1)
            const message = recvStringSplit[3].slice(0, -2)
            mqttSubscribeHandlers[topic] && mqttSubscribeHandlers[topic](message)
            recvString = ""
        }

        if (recvString.includes("Congratu")) {
            recvString = ""
            control.raiseEvent(EspEventSource, EspEventValue.PostIFTTT)
        }

        switch (currentCmd) {
            case Cmd.ConnectWifi:
                if (recvString.includes("AT+CWJAP")) {
                    recvString = recvString.slice(recvString.indexOf("AT+CWJAP"))
                    if (recvString.includes("WIFI GOT IP")) {
                        wifi_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectWifi)
                    } else if (recvString.includes("ERROR")) {
                        wifi_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectWifi)
                    }
                }
                break
            case Cmd.ConnectThingSpeak:
                if (recvString.includes(THINGSPEAK_HOST)) {
                    recvString = recvString.slice(recvString.indexOf(THINGSPEAK_HOST))
                    if (recvString.includes("CONNECT")) {
                        thingspeak_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectThingSpeak)
                    } else if (recvString.includes("ERROR")) {
                        thingspeak_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectThingSpeak)
                    }
                }
                break
            case Cmd.ConnectSmartIot:
                if (recvString.includes(SMARTIOT_HOST)) {
                    recvString = recvString.slice(recvString.indexOf(SMARTIOT_HOST))
                    if (recvString.includes("CONNECT")) {
                        smartiot_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectSmartIot)
                    }
                }
                break
            case Cmd.InitSmartIot:
                if (recvString.includes("AT+CIPSEND")) {
                    recvString = recvString.slice(recvString.indexOf("AT+CIPSEND"))
                    if (recvString.includes("OK")) {
                        smartiot_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.InitSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.InitSmartIot)
                    }
                } else {
                    if (recvString.includes("SEND OK")) {
                        smartiot_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.InitSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.InitSmartIot)
                    }
                }
                break
            case Cmd.UploadSmartIot:
                if (recvString.includes("AT+CIPSEND")) {
                    recvString = recvString.slice(recvString.indexOf("AT+CIPSEND"))
                    if (recvString.includes("OK")) {
                        smartiot_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.UploadSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.UploadSmartIot)
                    }
                } else {
                    if (recvString.includes("SEND OK")) {
                        smartiot_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.UploadSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.UploadSmartIot)
                    }
                }
                break
            case Cmd.DisconnectSmartIot:
                if (recvString.includes("AT+CIPSEND")) {
                    recvString = recvString.slice(recvString.indexOf("AT+CIPSEND"))
                    if (recvString.includes("OK")) {
                        smartiot_connected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.DisconnectSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.DisconnectSmartIot)
                    }
                } else {
                    if (recvString.includes("SEND OK")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.DisconnectSmartIot)
                    } else if (recvString.includes("ERROR")) {
                        smartiot_connected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.DisconnectSmartIot)
                    }
                }
                break
            case Cmd.ConnectMqtt:
                if (recvString.includes(mqtthost_def)) {
                    recvString = recvString.slice(recvString.indexOf(mqtthost_def))
                    if (recvString.includes("OK")) {
                        mqttBrokerConnected = true
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectMqtt)
                    } else if (recvString.includes("ERROR")) {
                        mqttBrokerConnected = false
                        recvString = ""
                        control.raiseEvent(EspEventSource, EspEventValue.ConnectMqtt)
                    }
                }
                break
        }
    })

    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 0) {
        serial.writeString(`${command}\u000D\u000A`)
        basic.pause(wait)
    }

    function restEsp8266() {
        sendAT("AT+RESTORE", 1000) // restore to factory settings
        sendAT("AT+RST", 1000) // rest
        serial.readString()
        sendAT("AT+CWMODE=1", 500) // set to STA mode
        sendAT("AT+SYSTIMESTAMP=1634953609130", 100) // Set local timestamp.
        sendAT(`AT+CIPSNTPCFG=1,8,"ntp1.aliyun.com","0.pool.ntp.org","time.google.com"`, 100)
    }

    /**
    * Initialize wifi module 
    */
    //% block="set wifi module %Rjpin Baud rate %baudrate"
    //% ssid.defl=your_ssid
    //% pw.defl=your_password weight=100
    //% color=#EA5532
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
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)
        restEsp8266()
    }
    /**
    * connect to Wifi router
    */
    //% block="connect Wifi SSID = %ssid|KEY = %pw"
    //% ssid.defl=your_ssid
    //% pw.defl=your_pw weight=95
    //% color=#EA5532
    export function connectWifi(ssid: string, pw: string) {
        currentCmd = Cmd.ConnectWifi
        sendAT(`AT+CWJAP="${ssid}","${pw}"`) // connect to Wifi router
        control.waitForEvent(EspEventSource, EspEventValue.ConnectWifi)
        while (!wifi_connected) {
            restEsp8266()
            sendAT(`AT+CWJAP="${ssid}","${pw}"`)
            control.waitForEvent(EspEventSource, EspEventValue.ConnectWifi)
        }
    }
    /**
    * Check if ESP8266 successfully connected to Wifi
    */
    //% block="Wifi connected %State" weight=70
    //% color=#EA5532
    export function wifiState(state: boolean) {
        return wifi_connected == state
    }
    /**
    * Connect to ThingSpeak
    */
    //% block="connect thingspeak"
    //% write_api_key.defl=your_write_api_key
    //% subcategory="ThingSpeak" weight=90
    //% color=#EA5532
    export function connectThingSpeak() {
        currentCmd = Cmd.ConnectThingSpeak
        // connect to server
        sendAT(`AT+CIPSTART="TCP","${THINGSPEAK_HOST}",${THINGSPEAK_PORT}`)
        control.waitForEvent(EspEventSource, EspEventValue.ConnectThingSpeak)
        pause(100)
    }
    /**
    * Connect to ThingSpeak and set data. 
    */
    //% block="set data to send ThingSpeak | Write API key = %write_api_key|Field 1 = %n1||Field 2 = %n2|Field 3 = %n3|Field 4 = %n4|Field 5 = %n5|Field 6 = %n6|Field 7 = %n7|Field 8 = %n8"
    //% write_api_key.defl=your_write_api_key
    //% expandableArgumentMode="enabled"
    //% subcategory="ThingSpeak" weight=85
    //% color=#EA5532
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
    //% color=#EA5532
    export function uploadData() {
        //sendAT("AT+CIPSEND=" + (TStoSendStr.length + 2), 300)
        sendAT(`AT+CIPSEND=${TStoSendStr.length + 2}`, 300)
        sendAT(TStoSendStr, 300) // upload data
    }

    /**
    * Check if ESP8266 successfully connected to ThingSpeak
    */
    //% block="ThingSpeak connected %State"
    //% subcategory="ThingSpeak" weight=65
    //% color=#EA5532
    export function thingSpeakState(state: boolean) {
        return thingspeak_connected == state
    }
    /*-----------------------------------smartiot---------------------------------*/
    /**
    * Connect to smartiot
    */
    //% subcategory=SmartIot weight=50
    //% blockId=initsmartiot block="Connect SmartIot with userToken: %userToken Topic: %topic"
    //% color=#EA5532
    export function connectSmartiot(userToken: string, topic: string): void {
        userToken_def = userToken
        topic_def = topic
        currentCmd = Cmd.ConnectSmartIot
        sendAT(`AT+CIPSTART="TCP","${SMARTIOT_HOST}",${SMARTIOT_PORT}`)
        control.waitForEvent(EspEventSource, EspEventValue.ConnectSmartIot)
        pause(100)
        const jsonText = `{"topic":"${topic}","userToken":"${userToken}","op":"init"}`
        currentCmd = Cmd.InitSmartIot
        sendAT(`AT+CIPSEND=${jsonText.length + 2}`)
        control.waitForEvent(EspEventSource, EspEventValue.InitSmartIot)
        if (smartiot_connected) {
            sendAT(jsonText)
            control.waitForEvent(EspEventSource, EspEventValue.InitSmartIot)
        }
        pause(1500)
    }
    /**
    * upload data to smartiot
    */
    //% subcategory=SmartIot weight=45
    //% blockId=uploadsmartiot block="Upload data %data to smartiot"
    //% color=#EA5532
    export function uploadSmartiot(data: number): void {
        data = Math.floor(data)
        const jsonText = `{"topic":"${topic_def}","userToken":"${userToken_def}","op":"up","data":"${data}"}`
        currentCmd = Cmd.UploadSmartIot
        sendAT(`AT+CIPSEND=${jsonText.length + 2}`)
        control.waitForEvent(EspEventSource, EspEventValue.UploadSmartIot)
        if (smartiot_connected) {
            sendAT(jsonText)
            control.waitForEvent(EspEventSource, EspEventValue.UploadSmartIot)
        }
        pause(1500)
    }
    /**
    * disconnect from smartiot
    */
    //% subcategory=SmartIot weight=40
    //% blockId=Disconnect block="Disconnect with smartiot"
    //% color=#EA5532
    export function disconnectSmartiot(): void {
        if (smartiot_connected) {
            const jsonText = `{"topic":"${topic_def}","userToken":"${userToken_def}","op":"close"}`
            currentCmd = Cmd.DisconnectSmartIot
            sendAT("AT+CIPSEND=" + (jsonText.length + 2))
            control.waitForEvent(EspEventSource, EspEventValue.DisconnectSmartIot)
            if (smartiot_connected) {
                sendAT(jsonText)
                control.waitForEvent(EspEventSource, EspEventValue.DisconnectSmartIot)
            }
            pause(1500)
        }
    }
    /**
    * Check if ESP8266 successfully connected to SmartIot
    */
    //% block="SmartIot connection %State"
    //% subcategory="SmartIot" weight=35
    //% color=#EA5532
    export function smartiotState(state: boolean) {
        return smartiot_connected == state
    }
    //% block="When switch %vocabulary"
    //% subcategory="SmartIot" weight=30
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% color=#EA5532
    export function iotSwitchEvent(state: SmartIotSwitchState, handler: () => void) {
        //control.onEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, state, handler)
        control.onEvent(SmartIotEventSource, state, handler)
    }
    //     /*----------------------------------MQTT-----------------------*/
    //     /**
    //     * Set  MQTT client
    //     */
    //% subcategory=MQTT weight=30
    //% blockId=initMQTT block="Set MQTT client config|scheme: %scheme clientID: %clientID username: %username password: %password path: %path"
    //% color=#EA5532
    export function setMQTT(scheme: SchemeList, clientID: string, username: string, password: string, path: string): void {
        sendAT(`AT+MQTTUSERCFG=0,${scheme},"${clientID}","${username}","${password}",0,0,"${path}"`, 1000)
    }
    /**
   * Connect to MQTT broker
    */
    //% subcategory=MQTT weight=25
    //% blockId=connectMQTT block="connect MQTT broker host: %host port: %port reconnect: $reconnect"
    //% color=#EA5532
    export function connectMQTT(host: string, port: number, reconnect: boolean): void {
        mqtthost_def = host
        const rec = reconnect ? 0 : 1
        currentCmd = Cmd.ConnectMqtt
        sendAT(`AT+MQTTCONN=0,"${host}",${port},${rec}`)
        control.waitForEvent(EspEventSource, EspEventValue.ConnectMqtt)
        Object.keys(mqttSubscribeQos).forEach(topic => {
            const qos = mqttSubscribeQos[topic]
            sendAT(`AT+MQTTSUB=0,"${topic}",${qos}`, 1000)
        })
    }

    /**
      * Check if ESP8266 successfully connected to mqtt broker
     */
    //% block="MQTT broker is connected"
    //% subcategory="MQTT" weight=24
    //% color=#EA5532
    export function isMqttBrokerConnected() {
        return mqttBrokerConnected
    }

    /**
    * send message
     */
    //% subcategory=MQTT weight=21
    //% blockId=sendMQTT block="publish %msg to Topic:%topic with Qos:%qos"
    //% msg.defl=hello
    //% topic.defl=topic/1
    //% color=#EA5532
    export function publishMqttMessage(msg: string, topic: string, qos: QosList): void {
        sendAT(`AT+MQTTPUB=0,"${topic}","${msg}",${qos},0`, 1000)
    }

    /**
    * send message 
   */
    //% subcategory=MQTT weight=15
    //% blockId=breakMQTT block="Disconnect from broker"
    //% color=#EA5532
    export function breakMQTT(): void {
        sendAT("AT+MQTTCLEAN=0", 1000) // connect to website server
    }

    //% block="when Topic: %topic have new $message with Qos: %qos"
    //% subcategory=MQTT weight=10
    //% draggableParameters
    //% topic.defl=topic/1
    //% color=#EA5532
    export function MqttEvent(topic: string, qos: QosList, handler: (message: string) => void) {
        mqttSubscribeHandlers[topic] = handler
        mqttSubscribeQos[topic] = qos
    }


    //////////----------------------------------- IFTTT--------------------------------/////////
    /**
    * set ifttt
    */
    //% subcategory=IFTTT weight=9
    //% blockId=setIFTTT block="set IFTTT key:%key event:%event"
    //% color=#EA5532
    export function setIFTTT(key: string, event: string): void {
        iftttkey_def = key
        iftttevent_def = event
    }
    /**
    * post ifttt
    */
    //% subcategory=IFTTT weight=8
    //% blockId=postIFTTT block="post IFTTT with|value1:%value value2:%value2 value3:%value3"
    //% color=#EA5532
    export function postIFTTT(value1: string, value2: string, value3: string): void {
        let sendST1 = "AT+HTTPCLIENT=3,1,\"http://maker.ifttt.com/trigger/" + iftttevent_def + "/with/key/" + iftttkey_def + "\",,,2,"
        let sendST2 = "\"{\\\"value1\\\":\\\"" + value1 + "\\\"\\\,\\\"value2\\\":\\\"" + value2 + "\\\"\\\,\\\"value3\\\":\\\"" + value3 + "\\\"}\""
        let sendST = sendST1 + sendST2
        sendAT(sendST, 1000)
        //control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 7)
        control.waitForEvent(EspEventSource, EspEventValue.PostIFTTT)
    }

}
