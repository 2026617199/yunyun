import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";

const CloudSelect: React.FC<SelectProps> = (props) => {

    const {
        allowClear = true,
        placeholder = "请选择",
        ...rest
    } = props;

    return (
        <Select
            allowClear={allowClear}
            placeholder={placeholder}
            {...rest}
        />
    );
};

export default CloudSelect;
