 basic.forever(function () {
    PlanetX.showUserText(1, "Temp:" + PlanetX.octopus_BME280(PlanetX.BME280_state.BME280_temperature_C))
    PlanetX.showUserText(2, "Distance:" + PlanetX.Ultrasoundsensor(PlanetX.DigitalRJPin.J1, PlanetX.Distance_Unit_List.Distance_Unit_cm))
    if (PlanetX.buttonAB(PlanetX.DigitalRJPin.J1, PlanetX.ButtonStateList.A)) {
        PlanetX.motorfan(PlanetX.AnalogRJPin.J1, true, 80)
    }
})
