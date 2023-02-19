import React from 'react';

const ProgressBar = ({ progress }) => {
  const style = {
    minWidth: `${(((progress.width)*progress.percent)/100)}px`,
    minHeight: "4px",
    maxWidth: `${(((progress.width)*progress.percent)/100)}px`,
    backgroundColor: progress.color,
    borderRadius: "100px",
  };

  console.log(((progress.width)*60)/100);

  return (
    <div className="progress-bar bg-[#dee2e6]" style={{minWidth: `${progress.width}px`, minHeight: "3px", maxWidth: `${progress.width}px`, borderRadius: "40px"}}>
      <div className={`progress-bar__fill`} style={style}></div>
    </div>
  );
};

export default ProgressBar;