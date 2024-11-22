import { IconType } from 'react-icons';

interface StatusPropsProps {
  text: string;
  bg: string;
  color: string;
  icon: IconType;
}

const Status: React.FC<StatusPropsProps> = ({ text, bg, color, icon: Icon }) => {
  return (
    <div className={`${bg} ${color} px-1 rounded flex items-center gap-1`}>
      {text} <Icon size={15} />
    </div>
  );
};

export default Status;
