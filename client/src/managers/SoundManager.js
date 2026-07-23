// src/managers/SoundManager.js

// 1. Import the audio files (../ goes up one folder from managers, then into sounds)
import wrenchAudio from '../sounds/install/wrench.mp3';
import sheetAudio from '../sounds/install/sheet.mp3';
import latchAudio from '../sounds/install/latch.mp3';
import moveAudio from '../sounds/install/move.mp3';
import zapAudio from '../sounds/install/zap.mp3';
import clackAudio from '../sounds/install/clack.mp3';

const sounds = {
    wrench: new Audio(wrenchAudio),
    sheet: new Audio(sheetAudio),
    latch: new Audio(latchAudio),
    move: new Audio(moveAudio),
    zap: new Audio(zapAudio),
    clack: new Audio(clackAudio),
};

export const playInstallSound = (partId) => {
    let activeSound = null;

    if (['engine', 'gear-box', 'brake-disc-caliper', 'radiator', 'exhaust-pipe', 'tire'].includes(partId)) {
        activeSound = sounds.wrench;
    } else if (partId === 'body') {
        activeSound = sounds.sheet;
    } else if (['front-seat', 'rear-seat'].includes(partId)) {
        activeSound = sounds.latch;
    } else if (partId === 'fender') {
        activeSound = sounds.move;
    } else if (partId === 'battery') {
        activeSound = sounds.zap;
    } else if (['pedals', 'fuel-tank', 'steering-wheel'].includes(partId)) {
        activeSound = sounds.clack;
    }

    if (activeSound) {
        activeSound.currentTime = 0; 
        activeSound.play();
    }
};