import { IconType } from 'react-icons';

interface ActionBtnProps {
  icon: IconType;
  onclick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon: Icon, onclick, disabled }) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className={`flex items-center justify-center rounded cursor-pointer w-[40px] text-slate-700 border border-slate-400 ${
        disabled && 'opacity-50 cursor-not-allowed'
      }`}>
      <Icon size={18} />
    </button>
  );
};

export default ActionBtn;
