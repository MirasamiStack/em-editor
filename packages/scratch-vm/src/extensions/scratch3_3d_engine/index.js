const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Scratch3DEngineBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._models = new Map();
        this._camera = {
            x: 0,
            y: 0,
            z: 500,
            targetX: 0,
            targetY: 0,
            targetZ: 0
        };
        this._light = {
            intensity: 1,
            color: '#ffffff'
        };
    }

    getInfo () {
        return {
            id: 'engine3d',
            name: '3D Engine',
            color1: '#5E66F3',
            color2: '#4B52CF',
            blocks: [
                {
                    opcode: 'importMmdModel',
                    blockType: BlockType.COMMAND,
                    text: 'import MMD model [NAME] from [MODEL_URL]',
                    arguments: {
                        NAME: {type: ArgumentType.STRING, defaultValue: 'miku'},
                        MODEL_URL: {type: ArgumentType.STRING, defaultValue: 'https://example.com/model.pmx'}
                    }
                },
                {
                    opcode: 'importVmdMotion',
                    blockType: BlockType.COMMAND,
                    text: 'import VMD motion [MOTION_URL] for [NAME]',
                    arguments: {
                        MOTION_URL: {type: ArgumentType.STRING, defaultValue: 'https://example.com/dance.vmd'},
                        NAME: {type: ArgumentType.STRING, defaultValue: 'miku'}
                    }
                },
                {
                    opcode: 'setObjectPosition',
                    blockType: BlockType.COMMAND,
                    text: 'set [NAME] position x:[X] y:[Y] z:[Z]',
                    arguments: {
                        NAME: {type: ArgumentType.STRING, defaultValue: 'miku'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'setCamera',
                    blockType: BlockType.COMMAND,
                    text: 'set camera position x:[X] y:[Y] z:[Z]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 500}
                    }
                },
                {
                    opcode: 'cameraLookAt',
                    blockType: BlockType.COMMAND,
                    text: 'camera look at x:[X] y:[Y] z:[Z]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'setDirectionalLight',
                    blockType: BlockType.COMMAND,
                    text: 'set light intensity [INTENSITY] color [COLOR]',
                    arguments: {
                        INTENSITY: {type: ArgumentType.NUMBER, defaultValue: 1},
                        COLOR: {type: ArgumentType.COLOR, defaultValue: '#ffffff'}
                    }
                },
                {
                    opcode: 'renderScene',
                    blockType: BlockType.COMMAND,
                    text: 'render 3D scene'
                },
                {
                    opcode: 'getObjectPosition',
                    blockType: BlockType.REPORTER,
                    text: '[AXIS] of [NAME]',
                    arguments: {
                        AXIS: {type: ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x'},
                        NAME: {type: ArgumentType.STRING, defaultValue: 'miku'}
                    }
                }
            ],
            menus: {
                axisMenu: {
                    acceptReporters: false,
                    items: ['x', 'y', 'z']
                }
            }
        };
    }

    importMmdModel (args) {
        const name = Cast.toString(args.NAME);
        const modelUrl = Cast.toString(args.MODEL_URL);
        this._models.set(name, {
            modelUrl,
            motionUrl: null,
            position: {x: 0, y: 0, z: 0}
        });
    }

    importVmdMotion (args) {
        const name = Cast.toString(args.NAME);
        const motionUrl = Cast.toString(args.MOTION_URL);
        if (!this._models.has(name)) {
            this._models.set(name, {
                modelUrl: '',
                motionUrl,
                position: {x: 0, y: 0, z: 0}
            });
            return;
        }
        this._models.get(name).motionUrl = motionUrl;
    }

    setObjectPosition (args) {
        const name = Cast.toString(args.NAME);
        const objectState = this._models.get(name);
        if (!objectState) return;
        objectState.position.x = Cast.toNumber(args.X);
        objectState.position.y = Cast.toNumber(args.Y);
        objectState.position.z = Cast.toNumber(args.Z);
    }

    setCamera (args) {
        this._camera.x = Cast.toNumber(args.X);
        this._camera.y = Cast.toNumber(args.Y);
        this._camera.z = Cast.toNumber(args.Z);
    }

    cameraLookAt (args) {
        this._camera.targetX = Cast.toNumber(args.X);
        this._camera.targetY = Cast.toNumber(args.Y);
        this._camera.targetZ = Cast.toNumber(args.Z);
    }

    setDirectionalLight (args) {
        this._light.intensity = Cast.toNumber(args.INTENSITY);
        this._light.color = Cast.toString(args.COLOR);
    }

    renderScene () {
        this.runtime.emit('ENGINE_3D_SCENE_CHANGED', {
            models: Array.from(this._models.entries()),
            camera: {...this._camera},
            light: {...this._light}
        });
        this.runtime.requestRedraw();
    }

    getObjectPosition (args) {
        const name = Cast.toString(args.NAME);
        const axis = Cast.toString(args.AXIS).toLowerCase();
        const objectState = this._models.get(name);
        if (!objectState) return 0;
        if (axis === 'y') return objectState.position.y;
        if (axis === 'z') return objectState.position.z;
        return objectState.position.x;
    }
}

module.exports = Scratch3DEngineBlocks;
