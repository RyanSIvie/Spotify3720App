import React from 'react';
import ReactPlayer from 'react-player';

const Track = (props) => {
  

  return (
    <div><p>{props.track.name}</p><ReactPlayer playing={true} loop={true} height={50} controls={true} url={props.track.preview_url} /></div>
  );
};

export default Track;