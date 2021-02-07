/**
 * This extension is designed to programme and drive the Smart AI Lens(二郎神)
 */
//% color=#0031AF icon="\uf06e" weight=50
//% groups='["Basic", "Ball", "Face", "Card", "Color", "Tracking", "Learn"]'
//% block="PlanetX_AI-Lens"
namespace PlanetX_AILens {
    const CameraAdd = 0X14;
    let DataBuff = pins.createBuffer(9);
    /**
    * Status List of Ball
    */
    export enum FuncList {
        //% block="Card recognition"
        Card = 2,
        //% block="Face recognition" 
        Face = 6,
        //% block="Ball recognition"
        Ball = 7,
        //% block="Tracking recognition"
        Tracking = 8,
        //% block="Color recognition"
        Color = 9,
        //% block="Learn Object"
        Things = 10
    }
    /**
    * Status List of Ball
    */
    export enum Ballstatus {
        //% block="X"
        X = 2,
        //% block="Y"
        Y = 3,
        //% block="Size"
        Size = 4,
        //% block="Confidence level "
        Confidence = 6,
        //% block="Ball ID"
        ID = 8
    }
    /**
    * Status List of Face
    */
    export enum Facestatus {
        //% block="X"
        X = 2,
        //% block="Y"
        Y = 3,
        //% block="W"
        W = 4,
        //% block="H"
        H = 5,
        //% block="Confidence level "
        Confidence = 6,
        //% block="Face ID"
        ID = 8
    }
    /**
    * Status List of Card
    */
    export enum Cardstatus {
        //% block="X"
        X = 2,
        //% block="Y"
        Y = 3,
        //% block="Size"
        Size = 4,
        //% block="Confidence level "
        Confidence = 6,
        //% block="Card ID"
        ID = 8
    }
    /**
    * Status List of Color
    */
    export enum Colorstatus {
        //% block="X"
        X = 2,
        //% block="Y"
        Y = 3,
        //% block="Size"
        Size = 4,
        //% block="Confidence level "
        Confidence = 6,
        //% block="Color ID"
        ID = 8
    }
    /**
    * Status List of Color
    */
    export enum ColorLs {
        //% block="Black"
        black = 4,
        //% block="Blue"
        blue = 2,
        //% block="Green"
        green = 1,
        //% block="Red"
        red = 5,
        //% block="White"
        white = 6,
        //% block="Yellow"
        yellow = 3
    }

    export enum Linestatus {
        //% block="Angel"
        angel = 1,
        //% block="Width"
        width = 2,
        //% block="Len"
        len = 3
    }
    export enum LineTrend{
        //% block="Left"
        left,
        //% block="Right"
        right,
        //% block="Front"
        front,
        //% block="None"
        none
    }
    /**
    * Number Cards List
    */
    export enum numberCards{
        //% block="0"
        zero = 1,
        //% block="1"
        one = 2,
        //% block="2"
        two = 3,
        //% block="3"
        three = 4,
        //% block="4"
        four = 5,
        //% block="5"
        five = 6,
        //% block="6"
        six = 7,
        //% block="7"
        seven = 8,
        //% block="8"
        eight = 9,
        //% block="9"
        nine = 10
    }
    /*
    * Letters Cards List
    */
    export enum letterCards{
        //% block="A"
        A = 1,
        //% block="B"
        B = 2,
        //% block="C"
        C = 3,
        //% block="D"
        D = 4,
        //% block="E"
        E = 5
    }
    /*
    * Traffic Cards List
    */
    export enum trafficCards{
        //% block="Forward"
        forward = 18,
		//% block="Back"
        back = 20,
		//% block="Stop"
        stop = 19,
		//% block="Turn left"
        turnleft = 16,
		//% block="Turn right"
        turnright = 17
    }
    /*
    * Other Cards List
    */
    export enum otherCards{
        //% block="Mouse"
        mouse = 1,
		//% block="micro:bit"
        microbit = 2,
		//% block="Ruler"
        ruler = 3,
		//% block="Cat"
        cat = 4,
		//% block="Peer"
        peer = 5,
		//% block="Ship"
        ship = 6,
		//% block="Apple"
        apple = 7,
		//% block="Car"
        car = 8,
		//% block="Pan"
        pan = 9,
		//% block="Dog"
        dog = 10,
		//% block="Umbrella"
        umbrella = 11,
		//% block="Airplane"
        airplane = 12,
		//% block="Clock"
        clock = 13,
		//% block="Grape"
        grape = 14,
		//% block="Cup"
        cup = 15
    }
    export enum learnID{
        ID1 = 1,
        ID2 = 2,
        ID3 = 3,
        ID4 = 4,
        ID5 = 5
    }
    export enum ballColorList{
        //% block="Red"
        Red = 2,
		//% block="Blue"
        Blue = 1
    }
    /**
    * TODO: Waiting for module initialize.
    */
    //% block="Initialize AI-Lens via IIC port"
    //% group="Basic" weight=100
    export function initModule():void{
        let timeout = input.runningTime()
        while (!(pins.i2cReadNumber(CameraAdd, NumberFormat.Int8LE))) {
            if(input.runningTime() - timeout > 6000){ 
                while(true){
                    basic.showString("Init AILens Error!")
                }
            }
        }   
    }
    /**
    * TODO: Switch recognition objects.
    * @param fun Function list eg: FuncList.Face
    */
    //% block="Switch function as %fun"
    //% fun.fieldEditor="gridpicker"
    //% fun.fieldOptions.columns=3
    //% group="Basic" weight=95
    export function switchfunc(fun: FuncList):void{
        let funcBuff = pins.i2cReadBuffer(CameraAdd, 9)
        funcBuff[0]=0x20
        funcBuff[1]=fun
        pins.i2cWriteBuffer(CameraAdd, funcBuff)
    }

    /**
    * TODO: Get the image in a frame
    */
    //% block="Get one image from AI-Lens"
    //% group="Basic" weight=90
    export function cameraImage(): void {
        DataBuff = pins.i2cReadBuffer(CameraAdd, 9)
        basic.pause(30)
    }

    /**
    * TODO: Judge the image contains a ball
    */
    //% block="Image contains ball(s)"
    //% group="Ball" weight=85
    export function checkBall(): boolean {
        return DataBuff[0] == 7
    }
    //% block="Image contains %ballcolor ball"
    //% group="Ball" weight=84
    //% ballcolor.fieldEditor="gridpicker"
    //% ballcolor.fieldOptions.columns=2
    export function ballColor(ballcolor:ballColorList):boolean {
        if (DataBuff[0] == 7) {
            return ballcolor == DataBuff[1]
        }
        else{
            return false
        }
    }
    //% block="In the image get ball(s)' total"
    //% group="Ball" weight=83
    export function BallTotalNum():number{
        if (DataBuff[0] == 7) {
            return DataBuff[7]
        }
        else{
            return 0
        }
    }
    /**
    * TODO: In the image get ball(s)' info
    */
    //% block="In the image get ball(s)' info: %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Ball" weight=80
    export function ballData(status: Ballstatus): number {
        if (DataBuff[0] == 7) {
            switch (status) {
                case Ballstatus.X:
                    return DataBuff[2]
                    break
                case Ballstatus.Y:
                    return DataBuff[3]
                    break
                case Ballstatus.Size:
                    return DataBuff[4]
                    break
                case Ballstatus.Confidence:
                    return 100-DataBuff[6]
                    break
                case Ballstatus.ID:
                    return DataBuff[8]
                    break
                default:
                    return 0;
            }
        }
        else {
            return 0
        }
    }


    /**
    * TODO: Judge whether there is a face in the picture
    */
    //% block="Image contains a face"
    //% group="Face" weight=75
    export function checkFace(): boolean {
        return DataBuff[0] == 6
    }
    //% block="In the image get face(s)' total"
    //% group="Face" weight=74
    export function faceTotalNum():number{
        if (DataBuff[0] == 6) {
            return DataBuff[7]
        }
        else{
            return 0
        }
    }
    /**
    * TODO: Judge whether there is a face in the picture
    * @param status Facestatus, eg: Facestatus.X
    */
    //% block="In the image get face(s)' info: %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Face" weight=70
    export function faceData(status: Facestatus): number {
        if (DataBuff[0] == 6) {
            switch (status) {
                case Facestatus.X:
                    return DataBuff[2]
                    break
                case Facestatus.Y:
                    return DataBuff[3]
                    break
                case Facestatus.W:
                    return DataBuff[4]
                    break
                case Facestatus.H:
                    return DataBuff[5]
                    break
                case Facestatus.Confidence:
                    return 100 - DataBuff[6]
                    break
                case Facestatus.ID:
                    return DataBuff[8]
                    break
                default:
                    return 0
            }
        }
        else {
            return 0
        }
    }
    /**
    * TODO: Judge whether there is a digital card in the screen
    * @param status numberCards, eg: numberCards.1
    */
    //% block="Image contains number card(s): %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Card" weight=65
    export function numberCard(status:numberCards): boolean{
        if (DataBuff[0] == 2) {
            return status == DataBuff[1]
        }
        else
            return false
    }
    /**
    * TODO: Judge whether there is a letter card in the screen
    * @param status letterCards, eg: letterCards.A
    */
    //% block="Image contains letter card(s): %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Card" weight=60
    export function letterCard(status:letterCards): boolean{
        if (DataBuff[0] == 4) {
            return status == DataBuff[1]
        }
        else
            return false
    }
    /**
    * TODO: Judge whether there is a traffic card in the screen
    * @param status trafficCards, eg: trafficCards.forward
    */
    //% block="Image contains traffic card(s): %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Card" weight=55
    export function trafficCard(status:trafficCards): boolean{
        if (DataBuff[0] == 3) {
            return status == DataBuff[1]
        }
        else
            return false
    }
    /**
    * TODO: Judge whether there is a other card in the screen
    * @param status otherCards, eg: otherCards.cat
    */
    //% block="Image contains other card(s): %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Card" weight=50
    export function otherCard(status:otherCards): boolean{
        if (DataBuff[0] == 3) {
            return status == DataBuff[1]
        }
        else
            return false
    }
    //% block="In the image get Card(s)' total"
    //% group="Card" weight=49
    export function cardTotalNum():number{
        if (DataBuff[0] == 2 || DataBuff[0] == 3 || DataBuff[0] == 4) {
            return DataBuff[7]
        }
        else{
            return 0
        }
    }
    /**
    * TODO: Card parameters in the screen
    * @param status otherCards, eg: Cardstatus.X
    */
    //% block="In the image get Card(s)' info: %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Card" weight=45
    export function CardData(status: Cardstatus): number {
        if (DataBuff[0] == 2 || DataBuff[0] == 3 || DataBuff[0] == 4) {
            switch (status) {
                case Cardstatus.X:
                    return DataBuff[2]
                    break
                case Cardstatus.Y:
                    return DataBuff[3]
                    break
                case Cardstatus.Size:
                    return DataBuff[4]
                    break
                case Cardstatus.Confidence:
                    return 100-DataBuff[6]
                    break
                case Cardstatus.ID:
                    return DataBuff[8]
                    break
                default:
                    return 0
            }
        }
        else
            return 0
    }
    /**
    * TODO: Judge whether there is a color in the screen
    * @param status ColorLs, eg: ColorLs.red
    */
    //% block="Image contains color card(s): %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Color" weight=30
    export function colorCheck(status: ColorLs): boolean {
        if (DataBuff[0] == 9) {
            return status == DataBuff[1]
        }
        else
            return false
    }
    //% block="In the image get color card(s)' total"
    //% group="Color" weight=29
    export function colorTotalNum():number{
        if (DataBuff[0] == 9) {
            return DataBuff[7]
        }
        else{
            return 0
        }
    }
    /**
    * TODO: color parameters in the screen
    * @param status Colorstatus, eg: Colorstatus.X
    */
    //% block="In the image get color card(s)' info: %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Color" weight=25
    export function colorData(status: Colorstatus): number {
        if (DataBuff[0] == 9) {
            switch (status) {
                case Colorstatus.X:
                    return DataBuff[2]
                    break
                case Colorstatus.Y:
                    return DataBuff[3]
                    break
                case Colorstatus.Size:
                    return DataBuff[4]
                    break
                case Colorstatus.Confidence:
                    return 100-DataBuff[6]
                    break
                case Colorstatus.ID:
                    return DataBuff[8]
                    break
                default:
                    return 0
            }
        }
        else {
            return 0
        }
    }
    /**
    * TODO: line parameters in the screen
    * @param status Linestatus, eg: Linestatus.angle
    */
    //% block="In the image get line(s)' info: %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Tracking"
    //% weight=35
    export function lineData(status: Linestatus): number {
        if (DataBuff[0] == 8) {
            switch (status) {
                case Linestatus.angel:
                    return DataBuff[1]
                    break
                case Linestatus.width:
                    return DataBuff[2]
                    break
                case Linestatus.len:
                    return DataBuff[3]
                    break
                default:
                    return 0
            }
        }
        else
            return 0
    }
    /**
    * TODO: line parameters in the screen
    * @param status Linestatus, eg: Linestatus.angle
    */
    //% block="Image contains line's direction towards %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=2
    //% group="Tracking"
    //% weight=34
    export function lineDirection(status: LineTrend):boolean{
        if (DataBuff[0] == 8) {
            switch (status) {
                case LineTrend.none:
                    return false
                    break
                case LineTrend.left:
                    if(DataBuff[2] < 90){
                        return true
                    }
                    else{
                        return false
                    }
                    break
                case LineTrend.right:
                    if(DataBuff[2] > 130){
                        return true
                    }
                    else{
                        return false
                    }
                    break
                case LineTrend.front:
                    if(DataBuff[2] > 90 && DataBuff[2] < 130){
                        return true
                    }
                    else{
                        return false
                    }
                    break
            }
        }
        else{
            if(status==LineTrend.none)
                return true
        }
        return false
    }
    
    /**
    * TODO: Learn an object in a picture
    * @param thingsID Edit a label for the object, eg: 1
    */
    //% block="Learn an object with: %thingsID"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Learn" weight=20 
    export function learnObject(thingsID: learnID): void {
        let thingsBuf = pins.createBuffer(9)
        thingsBuf[0] = 10
        thingsBuf[1] = thingsID
        pins.i2cWriteBuffer(CameraAdd, thingsBuf)
    }
    /**
    * TODO: Clear Learned Objects
    */
    //% block="Clear learned objects"
    //% group="Learn" weight=15
    export function ClearlearnObject(): void {
        let thingsBuf = pins.createBuffer(9)
        thingsBuf[0] = 10
        thingsBuf[1] = 10
        pins.i2cWriteBuffer(CameraAdd, thingsBuf)
    }
    /**
    * TODO: Judge whether there are any learned objects in the picture
    */
    //% block="Image contains learned objects: %status"
    //% status.fieldEditor="gridpicker"
    //% status.fieldOptions.columns=3
    //% group="Learn" weight=14
    export function objectCheck(status: learnID): boolean {
        if (DataBuff[0] == 10) {
            return status == DataBuff[1]
        }
        else
            return false
    }
    /**
    * TODO: Judge whether there are any learned objects in the picture
    */
    //% block="In the image get learn object %thingsID Confidence"
    //% group="Learn" weight=10
    export function objectConfidence(thingsID: learnID): number{
        if (DataBuff[0] == 10 && DataBuff[2] < 30) {
            if(DataBuff[1] == thingsID){
                return 100-DataBuff[2]
            }
            else
            {
                return 0
            }
        }
    return 0
    } 
}