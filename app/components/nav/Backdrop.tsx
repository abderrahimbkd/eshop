import React from 'react';

interface BackdropProps {
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ onClick }) => {
  return <div onClick={onClick} className="z-20 bg-slate-200 opacity-50 w-screen h-screen fixed top-0 left-0"></div>;
};

export default Backdrop;
