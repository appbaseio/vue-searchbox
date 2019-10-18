import styled from "@appbaseio/vue-emotion";
import { css } from "emotion";

const right = css`
  right: 42px;
`;

const MicIcon = styled("div")`
  height: 40px;
  position: absolute;
  top: calc(50% - 20px);
  cursor: pointer;
  right: 0;
  ${({ iconPosition }) => {
    if (iconPosition === "right") {
      return right;
    }
    return css`
      right: 22px;
    `;
  }}
`;

export default MicIcon;
