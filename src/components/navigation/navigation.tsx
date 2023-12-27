import { Button, styled } from "@mui/material";
import { Menu, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SheetOptions } from "./types";
import SheetListMenu from "./menus";
import Sheet from "./sheet";

export interface NavigationProps {
  sheets: SheetOptions[];
  selectedIndex: number;
  onSheetSelected: (index: number) => void;
  onAddBlankSheet: () => void;
  onSheetColorChanged: (hex: string) => void;
  onSheetRenamed: (name: string) => void;
  conSheetDeleted: () => void;
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
      <StyledButton title={t("navigation.add_sheet")}>
        <Plus />
      </StyledButton>
      <StyledButton onClick={handleClick} title={t("navigation.sheet_list")}>
        <Menu />
      </StyledButton>
      <Sheets>
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
      </Sheets>
      <Divider />
      <Advert>ironcalc</Advert>
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

const StyledButton = styled(Button)`
  width: 24px;
  height: 24px;
  min-width: 0px;
  padding: 0px;
  color: #333;
  svg {
    width: 16px;
    height: 16px;
  }
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
  background-color: #FFF;
`;

const Sheets = styled("div")`
  display: flex;
  flex-grow: 2;
`;

const Divider = styled("div")`
  height: 10px;
  width: 1px;
  background-color: #eee;
  margin: 0px 20px 0px 20px;
`;

const Advert = styled("div")`
  color: #f2994a;
  margin-right: 12px;
`;

export default Navigation;
