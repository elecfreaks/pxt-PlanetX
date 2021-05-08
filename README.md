![](https://img.shields.io/badge/Platform-micro%3Abit-red) ![](https://img.shields.io/travis/com/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/v/release/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/last-commit/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/languages/top/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/issues/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/license/elecfreaks/pxt-PlanetX) 

# PlanetX Package

![](/PlanetX.png/)

This extension is designed to programme and drive the sensor series PlanetX(行星X) micro:bit expansion sensor, You can [get PlanetX from the Elecfreaks store](https://www.elecfreaks.com/)

## Code Example
```JavaScript

basic.forever(function () {
    PlanetX.showUserText(1, "Temp:" + PlanetX.octopus_BME280(PlanetX.BME280_state.BME280_temperature_C))
    PlanetX.showUserText(2, "Distance:" + PlanetX.Ultrasoundsensor(PlanetX.DigitalRJPin.J1, PlanetX.Distance_Unit_List.Distance_Unit_cm))
    if (PlanetX.buttonAB(PlanetX.DigitalRJPin.J1, PlanetX.ButtonStateList.A)) {
        PlanetX.motorfan(PlanetX.AnalogRJPin.J1, true, 80)
    }
})


```
## Supported targets

* for PXT/microbit

## License
MIT

