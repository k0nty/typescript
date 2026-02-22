console.log(`
Інструкція з використання функції triangle():
Функція приймає 4 аргументи: значення1, "тип1", значення2, "тип2".
Допустимі типи:
- "leg" (катет)
- "hypotenuse" (гіпотенуза)
- "adjacent angle" (прилеглий до катета кут)
- "opposite angle" (протилежний до катета кут)
- "angle" (один з двох гострих кутів, коли задана гіпотенуза)

Приклад виклику: triangle(7, "leg", 18, "hypotenuse");
`);

function toRadians(deg: number): number {
    return deg * (Math.PI / 180);
}

function toDegrees(rad: number): number {
    return rad * (180 / Math.PI);
}

function triangle(v1: number, t1: string, v2: number, t2: string): string {
    const validTypes: string[] = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];

    if (!validTypes.includes(t1) || !validTypes.includes(t2)) {
        console.log("Невідомий тип аргументу");
        return "failed";
    }

    if (v1 <= 0 || v2 <= 0) {
        return "Zero or negative input";
    }

    let a: number = 0;
    let b: number = 0;
    let c: number = 0;
    let alpha: number = 0;
    let beta: number = 0;

    const isAngle = (t: string): boolean => t === "adjacent angle" || t === "opposite angle" || t === "angle";
    if ((isAngle(t1) && v1 >= 90) || (isAngle(t2) && v2 >= 90)) {
        return "Invalid angle";
    }

    if (t1 === "leg" && t2 === "leg") {
        a = v1;
        b = v2;
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        alpha = toDegrees(Math.atan(a / b));
        beta = toDegrees(Math.atan(b / a));
    } 
    else if ((t1 === "leg" && t2 === "hypotenuse") || (t1 === "hypotenuse" && t2 === "leg")) {
        a = t1 === "leg" ? v1 : v2;
        c = t1 === "hypotenuse" ? v1 : v2;
        if (a >= c) return "Invalid hypotenuse";
        b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        alpha = toDegrees(Math.asin(a / c));
        beta = toDegrees(Math.asin(b / c));
    } 
    else if ((t1 === "leg" && t2 === "opposite angle") || (t1 === "opposite angle" && t2 === "leg")) {
        a = t1 === "leg" ? v1 : v2;
        alpha = t1 === "opposite angle" ? v1 : v2;
        c = a / Math.sin(toRadians(alpha));
        b = a / Math.tan(toRadians(alpha));
        beta = 90 - alpha;
    } 
    else if ((t1 === "leg" && t2 === "adjacent angle") || (t1 === "adjacent angle" && t2 === "leg")) {
        a = t1 === "leg" ? v1 : v2;
        beta = t1 === "adjacent angle" ? v1 : v2;
        c = a / Math.cos(toRadians(beta));
        b = a * Math.tan(toRadians(beta));
        alpha = 90 - beta;
    } 
    else if ((t1 === "hypotenuse" && t2 === "angle") || (t1 === "angle" && t2 === "hypotenuse")) {
        c = t1 === "hypotenuse" ? v1 : v2;
        alpha = t1 === "angle" ? v1 : v2;
        a = c * Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
        beta = 90 - alpha;
    } 
    else {
        console.log("Несумісна пара типів");
        return "failed";
    }

    console.log(`a = ${a}`);
    console.log(`b = ${b}`);
    console.log(`c = ${c}`);
    console.log(`alpha = ${alpha}`);
    console.log(`beta = ${beta}`);
    
    return "success";
}