import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useState } from 'react';

const IsStartContext = React.createContext(true);

const _DoubleClickButton: React.FC<
  {
    startBtnProps?: ButtonProps;
    endBtnProps?: ButtonProps;
    onFinalClick?: () => void;
  } & ButtonProps
> = (props) => {
  const { startBtnProps, endBtnProps, onFinalClick, children, ...othProps } = props;
  const [isStart, setIsStart] = useState(true);

  const handleClick = () => {
    if (isStart) {
      setIsStart(false);
    } else {
      onFinalClick && onFinalClick();
    }
  };

  const showStart = isStart && !props.loading;

  return (
    <IsStartContext.Provider value={isStart}>
      <Button
        {...(showStart ? startBtnProps : endBtnProps)}
        {...othProps}
        onBlur={() => setIsStart(true)}
        onClick={handleClick}>
        {children}
      </Button>
    </IsStartContext.Provider>
  );
};

const Start: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isStart = React.useContext(IsStartContext);
  return isStart ? <>{children}</> : null;
};

const End: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isStart = React.useContext(IsStartContext);
  return !isStart ? <>{children}</> : null;
};

const DoubleClickButton = _DoubleClickButton as typeof _DoubleClickButton & {
  Start: typeof Start;
  End: typeof End;
};

DoubleClickButton.Start = Start;
DoubleClickButton.End = End;

export default DoubleClickButton;
