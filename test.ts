 basic.forever(function () {
     PlanetX_Display.showUserText(1, "Temp:" + PlanetX_Basic.bme280Sensor(PlanetX_Basic.BME280_state.BME280_temperature_C))
     PlanetX_Display.showUserText(2, "Distance:" + PlanetX_Basic.ultrasoundSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.Distance_Unit_List.Distance_Unit_cm))
     if (PlanetX_Basic.buttonAB(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.ButtonStateList.A)) {
         PlanetX_Basic.motorFan(PlanetX_Basic.AnalogRJPin.J1, true, 80)
    }
})