const test = require('tap').test;
const Runtime = require('../../src/engine/runtime');
const Scratch3DEngineBlocks = require('../../src/extensions/scratch3_3d_engine');

test('3D engine extension stores model and coordinates', t => {
    const runtime = new Runtime();
    const extension = new Scratch3DEngineBlocks(runtime);

    extension.importMmdModel({NAME: 'miku', MODEL_URL: 'https://example.com/miku.pmx'});
    extension.setObjectPosition({NAME: 'miku', X: 12, Y: -8, Z: 100});

    t.equal(extension.getObjectPosition({NAME: 'miku', AXIS: 'x'}), 12);
    t.equal(extension.getObjectPosition({NAME: 'miku', AXIS: 'y'}), -8);
    t.equal(extension.getObjectPosition({NAME: 'miku', AXIS: 'z'}), 100);
    t.end();
});

test('3D engine extension emits scene event on render', t => {
    const runtime = new Runtime();
    const extension = new Scratch3DEngineBlocks(runtime);

    extension.importMmdModel({NAME: 'miku', MODEL_URL: 'https://example.com/miku.pmx'});
    extension.importVmdMotion({NAME: 'miku', MOTION_URL: 'https://example.com/wave.vmd'});
    extension.setCamera({X: 1, Y: 2, Z: 300});
    extension.cameraLookAt({X: 0, Y: 1, Z: 0});
    extension.setDirectionalLight({INTENSITY: 0.8, COLOR: '#ffeecc'});

    runtime.on('ENGINE_3D_SCENE_CHANGED', payload => {
        t.equal(payload.models.length, 1);
        t.equal(payload.models[0][0], 'miku');
        t.equal(payload.camera.z, 300);
        t.equal(payload.light.color, '#ffeecc');
        t.end();
    });

    extension.renderScene();
});
