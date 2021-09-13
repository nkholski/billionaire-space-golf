// import { ctx, DrawVector2 } from './graphics';
// import { GetCollisionPoint, GetCircleTangentReal, GetBounce, vector2Add } from './physics';
// import { state } from './state';
// export 
// const DrawToMouse = () => {
// 	let collides = false;
// 	let point = state.mouse;

// 	state.system.forEach(planet => {
// 		if(collides){
// 			return;
// 		}
// 		const colPoint = GetCollisionPoint(state.mouse, 5, planet.position, planet.size);
		
// 	if(	!colPoint	
// 		){
// 			return;
		
// 	}
// 	point = colPoint;
// 	collides = true;

// 			const tang = GetCircleTangentReal(colPoint,planet);
// 			const newV = GetBounce(colPoint,state.velocity, planet);


// 			ctx.beginPath();

// 			ctx.moveTo(colPoint.x - tang.x, colPoint.y - tang.y);
// 			ctx.lineTo(colPoint.x + tang.x, colPoint.y + tang.y);
// 			ctx.stroke();


// 			ctx.beginPath();
// 			ctx.strokeStyle  = "red";

// 			ctx.moveTo(colPoint.x, colPoint.y);
// 			ctx.lineTo(colPoint.x+newV.x, colPoint.y+newV.y);
// 			ctx.stroke();
// 			ctx.strokeStyle  = "black";

// })
// 	ctx.strokeStyle  = "green";

// 	DrawVector2(vector2Add(point, state.velocity,-1),state.velocity);
// 	ctx.strokeStyle  = "black";

// }