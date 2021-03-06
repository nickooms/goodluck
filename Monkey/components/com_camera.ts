import {create} from "../../common/mat4.js";
import {Mat4, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Camera {
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Pv: Mat4;
    Position: Vec3;
}

export function camera(fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            FovY: fovy,
            Near: near,
            Far: far,
            Projection: create(),
            Pv: create(),
            Position: [0, 0, 0],
        };
    };
}
