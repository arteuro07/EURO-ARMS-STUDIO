import {Config} from "@remotion/cli/config";

// Standard 2D rendering: no WebGL, no Three.js, no GPU renderer override.
Config.setChromiumOpenGlRenderer("angle");
