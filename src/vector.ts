// export interface Vector2Value {
//     x: number;
//     y: number;
// }

// export class Vector2 implements Vector2Value {

//     x = 0;
//     y = 0;

//     constructor(x:number|Vector2Value=0,y:number=0){
//         if(typeof(x)=="number"){
//             this.x = x;
//             this.y = y;
//         }
//         else {
//             this.x = x.x;
//             this.y = x.y;
//         }
//       }

//      _Add = (other:Vector2Value, m = 1) => ({
//         x: this.x + m * other.x,
//         y: this.y + m * other.y
//     })

//      Add = (other:Vector2Value) => this._Add(other)
//      Sub = (other:Vector2Value) => this._Add(other,-1)
//      Multiply = (v:number) => ({
//         x: this.x * v,
//         y: this.y * v
//     })
//     Dot = (other:Vector2Value) => this.x * other.x + this.y * other.y // https://www.mathsisfun.com/algebra/vectors-dot-product.html
//     N = (v: Vector2) => this.Multiply(1/Math.sqrt(v.x*v.x + v.y*v.y))
//     Magnitude = (v:Vector2) =>  Math.sqrt(v.x*v.x + v.y*v.y)

// }
