console.log("Використання: triangle(значення1, 'тип1', значення2, 'тип2')");
console.log("Допустимі типи: 'leg', 'hypotenuse', 'adjacent angle', 'opposite angle', 'angle'");

function toRadians(deg: number): number {
    return deg * (Math.PI / 180);
}

function toDegrees(rad: number): number {
    return rad * (180 / Math.PI);
}

function triangle(a1: number, t1: string, a2: number, t2: string): string {
    const validTypes: string[] = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];

    if (!validTypes.includes(t1) || !validTypes.includes(t2)) {
        console.log("Некоректні типи аргументів. Перечитайте інструкцію.");
        return "failed";
    }

    if (a1 <= 0 || a2 <= 0) {
        console.log("Zero or negative input");
        return "Zero or negative input";
    }

    let a: number = 0, b: number = 0, c: number = 0, alpha: number = 0, beta: number = 0;

    try {
        if ((t1 === "leg" && t2 === "hypotenuse") || (t1 === "hypotenuse" && t2 === "leg")) {
            a = t1 === "leg" ? a1 : a2;
            c = t1 === "hypotenuse" ? a1 : a2;
            if (a >= c) {
                console.log("Катет не може бути більшим або рівним гіпотенузі");
                return "failed";
            }
            b = Math.sqrt(c * c - a * a);
            alpha = toDegrees(Math.asin(a / c));
            beta = 90 - alpha;
        } 

        else if (t1 === "leg" && t2 === "leg") {
            a = a1;
            b = a2;
            c = Math.sqrt(a * a + b * b);
            alpha = toDegrees(Math.atan(a / b));
            beta = 90 - alpha;
        }

        else if ((t1 === "leg" && t2 === "opposite angle") || (t1 === "opposite angle" && t2 === "leg")) {
            a = t1 === "leg" ? a1 : a2;
            alpha = t1 === "opposite angle" ? a1 : a2;
            if (alpha >= 90) return "failed";
            c = a / Math.sin(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            beta = 90 - alpha;
        }
        else if ((t1 === "leg" && t2 === "adjacent angle") || (t1 === "adjacent angle" && t2 === "leg")) {
            a = t1 === "leg" ? a1 : a2;
            beta = t1 === "adjacent angle" ? a1 : a2;
            if (beta >= 90) return "failed";
            c = a / Math.cos(toRadians(beta));
            b = a * Math.tan(toRadians(beta));
            alpha = 90 - beta;
        }
        else if ((t1 === "hypotenuse" && t2 === "angle") || (t1 === "angle" && t2 === "hypotenuse")) {
            c = t1 === "hypotenuse" ? a1 : a2;
            alpha = t1 === "angle" ? a1 : a2;
            if (alpha >= 90) return "failed";
            a = c * Math.sin(toRadians(alpha));
            b = c * Math.cos(toRadians(alpha));
            beta = 90 - alpha;
        }
        else {
            console.log("Несумісна пара типів. Перечитайте інструкцію.");
            return "failed";
        }

        console.log(`a = ${a}`);
        console.log(`b = ${b}`);
        console.log(`c = ${c}`);
        console.log(`alpha = ${alpha}`);
        console.log(`beta = ${beta}`);
        return "success";

    } catch (e) {
        return "failed";
    }
}