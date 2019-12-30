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

const InputIcon = styled("div")`
  position: absolute;
  ${({ isClearIcon }) =>
    isClearIcon
      ? css`
          top: 12px;
        `
      : css`
          top: 13px;
        `};
  cursor: pointer;
  ${({ iconPosition }) => {
    if (iconPosition === "left") {
      return left;
    } else if (iconPosition === "right") {
      return right;
    }
    return null;
  }};
  ${({ clearIcon }) => clearIcon && clear};
  ${({ showIcon }) =>
    !showIcon &&
    css`
      padding-right: 10px;
    `}

  svg.search-icon {
    fill: #0b6aff;
  }
`;

export default InputIcon;
