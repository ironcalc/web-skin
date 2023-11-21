import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BorderBottomIcon,
  BorderCenterHIcon,
  BorderCenterVIcon,
  BorderInnerIcon,
  BorderLeftIcon,
  BorderOuterIcon,
  BorderRightIcon,
  BorderTopIcon,
  BorderNoneIcon,
  BorderStyleIcon,
} from "../icons";
import ColorPicker from "./colorPicker";
import { BorderStyle, BorderType, BorderOptions } from "../model/types";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import {
  Check,
  ChevronDown,
  Grid2X2 as BorderAllIcon,
  PencilLine,
} from "lucide-react";
import { styled } from "@mui/material/styles";
import { theme } from "../theme";

type BorderPickerProps = {
  className?: string;
  onChange: (border: BorderOptions) => void;
  anchorEl: React.RefObject<HTMLElement>;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  open: boolean;
};

const BorderPicker = (properties: BorderPickerProps) => {
  const { t } = useTranslation();

  const [borderSelected, setBorderSelected] = useState(BorderType.None);
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderStyle, setBorderStyle] = useState(BorderStyle.Thin);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [stylePickerOpen, setStylePickerOpen] = useState(false);
  const closePicker = (): void => {
    properties.onChange({
      color: borderColor,
      style: borderStyle,
      border: borderSelected,
    });
  };
  const borderColorButton = useRef(null);
  const borderStyleButton = useRef(null);
  return (
    <>
      <StyledPopover
        open={properties.open}
        onClose={(): void => closePicker()}
        anchorEl={properties.anchorEl.current}
        anchorOrigin={
          properties.anchorOrigin || { vertical: "bottom", horizontal: "left" }
        }
        transformOrigin={
          properties.transformOrigin || { vertical: "top", horizontal: "left" }
        }
      >
        <BorderPickerDialog>
          <Borders>
            <Line>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderAll}
                onClick={() => {
                  if (borderSelected === BorderType.BorderAll) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderAll);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderAllIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderInner}
                onClick={() => {
                  if (borderSelected === BorderType.BorderInner) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderInner);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderInnerIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderCenterH}
                onClick={() => {
                  if (borderSelected === BorderType.BorderCenterH) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderCenterH);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderCenterHIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderCenterV}
                onClick={() => {
                  if (borderSelected === BorderType.BorderCenterV) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderCenterV);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderCenterVIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderOuter}
                onClick={() => {
                  if (borderSelected === BorderType.BorderOuter) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderOuter);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderOuterIcon />
              </Button>
            </Line>
            <Line>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderNone}
                onClick={() => {
                  if (borderSelected === BorderType.BorderNone) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderNone);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderNoneIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderTop}
                onClick={() => {
                  if (borderSelected === BorderType.BorderTop) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderTop);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderTopIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderRight}
                onClick={() => {
                  if (borderSelected === BorderType.BorderRight) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderRight);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderRightIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderBottom}
                onClick={() => {
                  if (borderSelected === BorderType.BorderBottom) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderBottom);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderBottomIcon />
              </Button>
              <Button
                type="button"
                $pressed={borderSelected === BorderType.BorderLeft}
                onClick={() => {
                  if (borderSelected === BorderType.BorderLeft) {
                    setBorderSelected(BorderType.None);
                  } else {
                    setBorderSelected(BorderType.BorderLeft);
                  }
                }}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderLeftIcon />
              </Button>
            </Line>
          </Borders>
          <Divider />
          <Styles>
            <ButtonWrapper onClick={() => setColorPickerOpen(true)}>
              <Button
                type="button"
                $pressed={false}
                disabled={false}
                $underlinedColor={borderColor}
                ref={borderColorButton}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <PencilLine />
              </Button>
              <ChevronIcon />
            </ButtonWrapper>
            <ButtonWrapper onClick={() => setStylePickerOpen(true)}>
              <Button
                type="button"
                $pressed={false}
                ref={borderStyleButton}
                disabled={false}
                title={t("workbook.toolbar.borders_button_title")}
              >
                <BorderStyleIcon />
              </Button>
              <ChevronIcon />
            </ButtonWrapper>
          </Styles>
        </BorderPickerDialog>
        <ColorPicker
          color={borderColor}
          onChange={(color): void => {
            setBorderColor(color);
            setColorPickerOpen(false);
          }}
          anchorEl={borderColorButton}
          open={colorPickerOpen}
        />
        <StyledPopover
          open={stylePickerOpen}
          onClose={(): void => {
            setStylePickerOpen(false);
          }}
          anchorEl={borderStyleButton.current}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <BorderStyleDialog>
            <LineWrapper
              onClick={() => {
                setBorderStyle(BorderStyle.Thin);
                setStylePickerOpen(false);
              }}
            >
              <CheckIconWrapper>
                <CheckIcon $checked={borderStyle === BorderStyle.Thin} />
              </CheckIconWrapper>
              <SolidLine />
            </LineWrapper>
            <LineWrapper
              onClick={() => {
                setBorderStyle(BorderStyle.Medium);
                setStylePickerOpen(false);
              }}
            >
              <CheckIconWrapper>
                <CheckIcon $checked={borderStyle === BorderStyle.Medium} />
              </CheckIconWrapper>
              <MediumLine />
            </LineWrapper>
            <LineWrapper
              onClick={() => {
                setBorderStyle(BorderStyle.Thick);
                setStylePickerOpen(false);
              }}
            >
              <CheckIconWrapper>
                <CheckIcon $checked={borderStyle === BorderStyle.Thick} />
              </CheckIconWrapper>
              <ThickLine />
            </LineWrapper>
            <LineWrapper
              onClick={() => {
                setBorderStyle(BorderStyle.Dotted);
                setStylePickerOpen(false);
              }}
            >
              <CheckIconWrapper>
                <CheckIcon $checked={borderStyle === BorderStyle.Dotted} />
              </CheckIconWrapper>
              <DottedLine />
            </LineWrapper>
            <LineWrapper
              onClick={() => {
                setBorderStyle(BorderStyle.Dashed);
                setStylePickerOpen(false);
              }}
            >
              <CheckIconWrapper>
                <CheckIcon $checked={borderStyle === BorderStyle.Dashed} />
              </CheckIconWrapper>
              <DashedLine />
            </LineWrapper>
            {/* TODO: Add the double line */}
          </BorderStyleDialog>
        </StyledPopover>
      </StyledPopover>
    </>
  );
};

const LineWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    background-color: ${theme.palette.grey["400"]};
    border-top-color: ${theme.palette.grey["400"]};
  }
  cursor: pointer;
`;

const CheckIconWrapper = styled("div")`
  width: 12px;
`;

type CheckIconProperties = { $checked: boolean };
const CheckIcon = styled(Check)<CheckIconProperties>`
  font-size: 7px;
  visibility: ${({ $checked }): string => {
    if ($checked) {
      return "visible";
    }
    return "hidden";
  }};
`;

const SolidLine = styled("div")`
  width: 40px;
  border-top: 1px solid grey;
`;
const MediumLine = styled("div")`
  width: 40px;
  border-top: 2px solid grey;
`;
const ThickLine = styled("div")`
  width: 40px;
  border-top: 3px solid grey;
`;
const DashedLine = styled("div")`
  width: 40px;
  border-top: 1px dashed grey;
`;
const DottedLine = styled("div")`
  width: 40px;
  border-top: 1px dotted grey;
`;
// const DoubleLine = styled('div')`
//   width: 40px;
//   border-top: 3px double grey;
// `;

const Divider = styled("div")`
  display: inline-flex;
  width: 1px;
  border-left: 1px solid #d3d6e9;
  margin-left: 5px;
  margin-right: 5px;
`;

const Borders = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Styles = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Line = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    background-color: ${(): string => theme.palette.grey["400"]};
    border-top-color: ${(): string => theme.palette.grey["400"]};
  }
  cursor: pointer;
`;

const BorderStyleDialog = styled("div")`
  background: ${({ theme }): string => theme.palette.background.default};
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    border-radius: 10px;
    border: 0px solid ${({ theme }): string => theme.palette.background.default};
    box-shadow: 1px 2px 8px rgba(139, 143, 173, 0.5);
  }
  .MuiPopover-padding {
    padding: 0px;
  }
  .MuiList-padding {
    padding: 0px;
  }
`;

const BorderPickerDialog = styled("div")`
  background: ${({ theme }): string => theme.palette.background.default};
  padding: 15px;
  display: flex;
  flex-direction: row;
`;

// type TypeButtonProperties = { $pressed: boolean; $underlinedColor?: string };
// const Button = styled.button<TypeButtonProperties>`
//   width: 23px;
//   height: 23px;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 14px;
//   border-radius: 2px;
//   margin-right: 5px;
//   transition: all 0.2s;

//   ${({ theme, disabled, $pressed, $underlinedColor }): string => {
//     if (disabled) {
//       return `
//       color: ${theme.palette.grey['600']};
//       cursor: default;
//     `;
//     }
//     return `
//       border-top: ${$underlinedColor ? '3px solid #FFF' : 'none'};
//       border-bottom: ${$underlinedColor ? `3px solid ${$underlinedColor}` : 'none'};
//       color: ${theme.palette.text.primary};
//       background-color: ${$pressed ? theme.palette.grey['600'] : '#FFF'};
//       &:hover {
//         background-color: ${theme.palette.grey['400']};
//         border-top-color: ${theme.palette.grey['400']};
//       }
//     `;
//   }}
// `;

type TypeButtonProperties = { $pressed: boolean; $underlinedColor?: string };
const Button = styled("button")<TypeButtonProperties>(
  ({ disabled, $pressed, $underlinedColor }) => {
    let result: Record<string, any> = {
      width: "25px",
      height: "25px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px",
      border: "0px solid #fff",
      borderRadius: "2px",
      marginRight: "5px",
      transition: "all 0.2s",
      cursor: "pointer",
      backgroundColor: "white",
      padding: "0px",
    };
    if (disabled) {
      result.color = theme.palette.grey["600"];
      result.cursor = "default";
    } else {
      result.borderTop = $underlinedColor ? "3px solid #FFF" : "none";
      result.borderBottom = $underlinedColor
        ? `3px solid ${$underlinedColor}`
        : "none";
      (result.color = "#21243A"), //theme.palette.text.primary;
        (result.backgroundColor = $pressed
          ? theme.palette.grey["600"]
          : "#FFF");
      result["&:hover"] = {
        backgroundColor: "#F1F2F8",
        borderTopColor: "#F1F2F8",
      };
      result["svg"] = {
        width: "24px",
        height: "24px",
      };
    }
    return result;
  }
);

const ChevronIcon = styled(ChevronDown)`
  margin-left: 4px;
  font-size: 7px;
`;

export default BorderPicker;
