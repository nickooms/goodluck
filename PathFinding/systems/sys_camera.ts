import {invert, multiply, perspective} from "../../common/mat4.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.CanvasScene.width = game.CanvasBillboard.width =
            window.innerWidth;
        game.ViewportHeight = game.CanvasScene.height = game.CanvasBillboard.height =
            window.innerHeight;
        game.ViewportResized = true;
    }

    game.Camera = undefined;
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);

            // Support only one camera per scene.
            return;
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let camera = game.World.Camera[entity];
    game.Camera = camera;

    if (game.ViewportResized) {
        let aspect = game.ViewportWidth / game.ViewportHeight;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FovY, aspect, camera.Near, camera.Far);
            invert(camera.Unproject, camera.Projection);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FovY / aspect, aspect, camera.Near, camera.Far);
            invert(camera.Unproject, camera.Projection);
        }
    }

    multiply(camera.Pv, camera.Projection, transform.Self);
}
