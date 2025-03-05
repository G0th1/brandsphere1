import * as React from 'react';

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
}

declare const Switch: React.ForwardRefExoticComponent<
    SwitchProps & React.RefAttributes<HTMLDivElement>
>;

export { Switch, SwitchProps }; 