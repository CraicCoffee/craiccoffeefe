import React from 'react';

const NewBrewButton = ({ onNewBrew }) => {
  return (
    <button onClick={onNewBrew} style={{ position: 'absolute', top: '10px', right: '10px' }}>
      新建冲煮信息
    </button>
  );
};

export default NewBrewButton;
