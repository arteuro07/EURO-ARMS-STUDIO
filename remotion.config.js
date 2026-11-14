import {Config} from "@remotion/cli/config";

// GitHub Actions runners have no physical GPU: use ANGLE + SwiftShader.
Config.setChromiumOpenGlRenderer("swangle");
