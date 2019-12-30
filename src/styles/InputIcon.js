import styled from "@appbaseio/vue-emotion";
import { css } from "emotion";

const left = css`
  padding-left: 12px;
  left: 0;
`;

const right = css`
  padding-right: 12px;
  right: 0;
`;

const clear = css`
  padding-right: 32px;
  right: 0;
  top: 12px;
`;

const top = props => {
  if (props.isClearIcon)
    return css`
      top: 12px;
    `;
  return css`
    top: 13px;
  `;
};

const icon = props => {
  if (props.iconPosition === "left") return left;
  if (props.iconPosition === "right") return right;
  return null;
};

const clearCss = props => {
  if (props.clearIcon) return clear;
  return null;
};

const showIcon = props => {
  if (!props.showIcon)
    return css`
      padding-right: 10px;
    `;
  return null;
};

const InputIcon = styled("div")`
  position: absolute;
  ${top}
  ${icon}
  ${clearCss}
  ${showIcon}

  svg.search-icon {
    fill: #0b6aff;
  }
`;

export default InputIcon;
