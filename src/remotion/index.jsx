import React from "react";
import {Composition, registerRoot} from "remotion";
import {DesertEagleEpisode} from "./DesertEagleEpisode.jsx";

const Root = () => (
  <Composition
    id="DesertEagle"
    component={DesertEagleEpisode}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={1200}
    defaultProps={{timeline:{duration:40,segments:[]}}}
    calculateMetadata={({props}) => ({
      durationInFrames: Math.max(1, Math.ceil(Number(props.timeline?.duration || 40) * 30))
    })}
  />
);
registerRoot(Root);
