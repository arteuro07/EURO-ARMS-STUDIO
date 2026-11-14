import React from "react";
import {Composition, registerRoot} from "remotion";
import {DesertEagleEpisode} from "./DesertEagleEpisode.jsx";
import {Motion3DShowcase} from "./Motion3DShowcase.jsx";
import {DesertEagleHistory3D} from "./DesertEagleHistory3D.jsx";

const Root = () => (
  <>
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
    <Composition
      id="Motion3DShowcase"
      component={Motion3DShowcase}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={360}
    />
    <Composition
      id="DesertEagleHistory3D"
      component={DesertEagleHistory3D}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={450}
    />
  </>
);

registerRoot(Root);
