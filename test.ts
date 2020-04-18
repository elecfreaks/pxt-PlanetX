OLED.init(128, 64)
basic.forever(function () {
    if (Stars.buttonAB(Stars.DigitalRJPin.J3, Stars.ButtonStateList.B)) {
        OLED.writeNum(Stars.LightSensor(Stars.AnalogRJPin.J1))
        OLED.writeNum(Stars.NoiseSensor(Stars.AnalogRJPin.J2))
        basic.pause(1000)
    } else if (Stars.buttonAB(Stars.DigitalRJPin.J3, Stars.ButtonStateList.B)) {
        Stars.Relay(Stars.DigitalRJPin.J4, Stars.RelayStateList.On)
    }
})
