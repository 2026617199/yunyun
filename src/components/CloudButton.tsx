import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";

const CloudButton: React.FC<ButtonProps> = (props) => {

    const {
        size = "middle",
        type = "primary",
        ...rest
    } = props;

    return (
        <Button
            size={size}
            type={type}
            {...rest}
        />
    );
};

export default CloudButton;
