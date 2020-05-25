 basic.forever(function () {
    PlanetX.showUserText(1, "Temp:" + PlanetX.bme280Sensor(PlanetX.BME280_state.BME280_temperature_C))
    PlanetX.showUserText(2, "Distance:" + PlanetX.ultrasoundSensor(PlanetX.DigitalRJPin.J1, PlanetX.Distance_Unit_List.Distance_Unit_cm))
    if (PlanetX.buttonAB(PlanetX.DigitalRJPin.J1, PlanetX.ButtonStateList.A)) {
        PlanetX.motorFan(PlanetX.AnalogRJPin.J1, true, 80)
    }
})
