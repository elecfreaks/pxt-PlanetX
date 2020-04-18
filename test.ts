OLED.init(128, 64)
basic.forever(function () {
    if (PlanetX.buttonAB(PlanetX.DigitalRJPin.J3, PlanetX.ButtonStateList.B)) {
        OLED.writeNum(PlanetX.LightSensor(PlanetX.AnalogRJPin.J1))
        OLED.writeNum(PlanetX.NoiseSensor(PlanetX.AnalogRJPin.J2))
        basic.pause(1000)
    } else if (PlanetX.buttonAB(PlanetX.DigitalRJPin.J3, PlanetX.ButtonStateList.B)) {
        PlanetX.Relay(PlanetX.DigitalRJPin.J4, PlanetX.RelayStateList.On)
    }
})
