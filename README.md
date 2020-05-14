![](https://img.shields.io/badge/Plantfrom-Micro%3Abit-red) ![](https://img.shields.io/travis/com/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/v/release/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/last-commit/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/languages/top/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/issues/elecfreaks/pxt-PlanetX) ![](https://img.shields.io/github/license/elecfreaks/pxt-PlanetX) 

# PlanetX Package

![](/PlanetX.png/)

This extension is designed to programme and drive the NeZha micro:bit expansion board, You can [get NeZha from the Elecfreaks store](https://www.elecfreaks.com/store/nezha-breakout-board-for-micro-bit.html)

## Code Example
```JavaScript

input.onButtonPressed(Button.A, function () {
    neZha.setMotorSpeed(neZha.MotorList.M1, 100)
    neZha.setMotorSpeed(neZha.MotorList.M2, 100)
    neZha.setMotorSpeed(neZha.MotorList.M3, 100)
    neZha.setMotorSpeed(neZha.MotorList.M4, 100)
})
input.onButtonPressed(Button.B, function () {
    neZha.setServoAngel(neZha.ServoList.S1, 119)
    neZha.setServoSpeed(neZha.ServoList.S2, -58)
})
input.onButtonPressed(Button.AB, function () {
    neZha.stopAllMotor()
})
basic.forever(function () {
	
})

```
## Supported targets

* for PXT/microbit

## License
MIT

