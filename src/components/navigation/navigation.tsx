import { styled } from "@mui/material";
import { ChevronLeft, ChevronRight, Menu, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SheetOptions } from "./types";
import SheetListMenu from "./menus";
import Sheet from "./sheet";
import { StyledButton } from "../toolbar";

export interface NavigationProps {
  sheets: SheetOptions[];
  selectedIndex: number;
  onSheetSelected: (index: number) => void;
  onAddBlankSheet: () => void;
  onSheetColorChanged: (hex: string) => void;
  onSheetRenamed: (name: string) => void;
  onSheetDeleted: () => void;
}

function Navigation(props: NavigationProps) {
  const { t } = useTranslation();
  const { onSheetSelected, sheets, selectedIndex } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container>
      <StyledButton title={t("navigation.add_sheet")} $pressed={false}>
        <Plus />
      </StyledButton>
      <StyledButton onClick={handleClick} title={t("navigation.sheet_list")} $pressed={false}>
        <Menu />
      </StyledButton>
      <Sheets>
        <SheetInner>
          {sheets.map((tab, index) => (
            <Sheet
              key={tab.sheetId}
              name={tab.name}
              color={tab.color}
              selected={index === selectedIndex}
              onSelected={() => onSheetSelected(index)}
              onColorChanged={function (hex: string): void {
                console.log("Picked:", hex);
                throw new Error("Function not implemented.");
              }}
              onRenamed={function (name: string): void {
                console.log("Renamed:", name);
                throw new Error("Function not implemented.");
              }}
              onDeleted={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))}
        </SheetInner>
      </Sheets>
      <LeftDivider />
      <ChevronLeftStyled />
      <ChevronRightStyled />
      <RightDivider />
      <Advert>ironcalc.com</Advert>
      <SheetListMenu
        anchorEl={anchorEl}
        isOpen={open}
        close={handleClose}
        sheetOptionsList={sheets}
        onSheetSelected={onSheetSelected}
      />
    </Container>
  );
}


const ChevronLeftStyled = styled(ChevronLeft)`
  color: #333333;
  width: 16px;
  height: 16px;
  padding: 4px;
  cursor: pointer;
`;

const ChevronRightStyled = styled(ChevronRight)`
  color: #333333;
  width: 16px;
  height: 16px;
  padding: 4px;
  cursor: pointer;
`;

// Note I have to specify the font-family in every component that can be considered stand-alone
const Container = styled("div")`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  height: 40px;
  align-items: center;
  padding-left: 12px;
  font-family: Inter;
  background-color: #fff;
`;

const Sheets = styled("div")`
  flex-grow: 2;
  overflow: hidden;
`;

const SheetInner = styled("div")`
  display: flex;
`;

const LeftDivider = styled("div")`
  height: 10px;
  width: 1px;
  background-color: #eee;
  margin: 0px 10px 0px 0px;
`;

const RightDivider = styled("div")`
  height: 10px;
  width: 1px;
  background-color: #eee;
  margin: 0px 20px 0px 10px;
`;

const Advert = styled("div")`
  color: #f2994a;
  margin-right: 12px;
  font-size: 12px;
`;

export default Navigation;
