import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Euro,
  Italic,
  PaintBucket,
  Paintbrush2,
  Percent,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Grid2X2,
  Type,
  ArrowDownToLine,
  ArrowUpToLine,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import ColorPicker from './colorPicker';
import BorderPicker from './borderPicker';
import { ArrowMiddleFromLine, DecimalPlacesDecreaseIcon, DecimalPlacesIncreaseIcon } from '../icons';
import { NumberFormats, decreaseDecimalPlaces, increaseDecimalPlaces } from './formatUtil';
import FormatMenu from './formatMenu';
import { styled } from '@mui/material/styles';
import { theme } from '../theme';
import { BorderOptions } from '../model/types';


type VerticalAlign = "top" | "center" | "bottom";

type ToolbarProperties = {
  canUndo: boolean;
  canRedo: boolean;
  onRedo: () => void;
  onUndo: () => void;
  onToggleUnderline: () => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleStrike: () => void;
  onToggleHorizontalAlignLeft: () => void;
  onToggleHorizontalAlignCenter: () => void;
  onToggleHorizontalAlignRight: () => void;
  onToggleVerticalAlignTop: () => void;
  onToggleVerticalAlignCenter: () => void;
  onToggleVerticalAlignBottom: () => void;
  onCopyStyles: () => void;
  onTextColorPicked: (hex: string) => void;
  onFillColorPicked: (hex: string) => void;
  onNumberFormatPicked: (numberFmt: string) => void;
  onBorderChanged: (border: BorderOptions) => void;
  fillColor: string;
  fontColor: string;
  bold: boolean;
  underline: boolean;
  italic: boolean;
  strike: boolean;
  horizontalAlign: string;
  verticalAlign: VerticalAlign;
  canEdit: boolean;
  numFmt: string;
};

function Toolbar(properties: ToolbarProperties) {
  const [fontColor, _setFontColor] = useState(properties.fontColor);
  const [fillColor, _setFillColor] = useState(properties.fillColor);
  const [fontColorPickerOpen, setFontColorPickerOpen] = useState(false);
  const [fillColorPickerOpen, setFillColorPickerOpen] = useState(false);
  const [borderPickerOpen, setBorderPickerOpen] = useState(false);

  const fontColorButton = useRef(null);
  const fillColorButton = useRef(null);
  const borderButton = useRef(null);

  const { t } = useTranslation();

  const { canEdit } = properties;

  return (
    <ToolbarContainer>
      <Button
        type="button"
        $pressed={false}
        onClick={properties.onUndo}
        disabled={!properties.canUndo}
        title={t('toolbar.undo')}
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        $pressed={false}
        onClick={properties.onRedo}
        disabled={!properties.canRedo}
        title={t('toolbar.redo')}
      >
        <Redo2 />
      </Button>
      <Divider />
      <Button
        type="button"
        $pressed={false}
        onClick={properties.onCopyStyles}
        title={t('toolbar.copy_styles')}
      >
        <Paintbrush2 />
      </Button>
      <Divider />
      <Button
        type="button"
        $pressed={false}
        onClick={(): void => {
          properties.onNumberFormatPicked(NumberFormats.CURRENCY_EUR);
        }}
        disabled={!canEdit}
        title={t('toolbar.euro')}
      >
        <Euro />
      </Button>
      <Button
        type="button"
        $pressed={false}
        onClick={(): void => {
          properties.onNumberFormatPicked(NumberFormats.PERCENTAGE);
        }}
        disabled={!canEdit}
        title={t('toolbar.percentage')}
      >
        <Percent />
      </Button>
      <Button
        type="button"
        $pressed={false}
        onClick={(): void => {
          properties.onNumberFormatPicked(decreaseDecimalPlaces(properties.numFmt));
        }}
        disabled={!canEdit}
        title={t('toolbar.decimal_places_decrease')}
      >
        <DecimalPlacesDecreaseIcon />
      </Button>
      <Button
        type="button"
        $pressed={false}
        onClick={(): void => {
          properties.onNumberFormatPicked(increaseDecimalPlaces(properties.numFmt));
        }}
        disabled={!canEdit}
        title={t('toolbar.decimal_places_increase')}
      >
        <DecimalPlacesIncreaseIcon />
      </Button>
      <FormatMenu
        numFmt={properties.numFmt}
        onChange={(numberFmt): void => {
          properties.onNumberFormatPicked(numberFmt);
        }}
        onExited={(): void => {}}
        anchorOrigin={{
          horizontal: 20, // Aligning the menu to the middle of FormatButton
          vertical: 'bottom',
        }}
      >
        <Button
          type="button"
          $pressed={false}
          disabled={!canEdit}
          title={t('toolbar.format_number')}
          sx={{
            width: '40px', // Keep in sync with anchorOrigin in FormatMenu above
            fontSize: '13px',
            fontWeight: 400,
          }}
        >
          {'123'}
          <ChevronDown />
        </Button>
      </FormatMenu>
      <Divider />
      <Button
        type="button"
        $pressed={properties.bold}
        onClick={properties.onToggleBold}
        disabled={!canEdit}
        title={t('toolbar.bold')}
      >
        <Bold />
      </Button>
      <Button
        type="button"
        $pressed={properties.italic}
        onClick={properties.onToggleItalic}
        disabled={!canEdit}
        title={t('toolbar.italic')}
      >
        <Italic />
      </Button>
      <Button
        type="button"
        $pressed={properties.underline}
        onClick={properties.onToggleUnderline}
        disabled={!canEdit}
        title={t('toolbar.underline')}
      >
        <Underline />
      </Button>
      <Button
        type="button"
        $pressed={properties.strike}
        onClick={properties.onToggleStrike}
        disabled={!canEdit}
        title={t('toolbar.strike_trough')}
      >
        <Strikethrough />
      </Button>
      <Divider />
      <Button
        type="button"
        $pressed={false}
        disabled={!canEdit}
        title={t('toolbar.font_color')}
        ref={fontColorButton}
        $underlinedColor={fontColor}
        onClick={() => setFontColorPickerOpen(true)}
      >
        <Type />
      </Button>
      <Button
        type="button"
        $pressed={false}
        disabled={!canEdit}
        title={t('toolbar.fill_color')}
        ref={fillColorButton}
        $underlinedColor={fillColor}
        onClick={() => setFillColorPickerOpen(true)}
      >
        <PaintBucket />
      </Button>
      <Divider />
      <Button
        type="button"
        $pressed={properties.horizontalAlign === 'left'}
        onClick={properties.onToggleHorizontalAlignLeft}
        disabled={!canEdit}
        title={t('toolbar.align_left')}
      >
        <AlignLeft />
      </Button>
      <Button
        type="button"
        $pressed={properties.horizontalAlign === 'center'}
        onClick={properties.onToggleHorizontalAlignCenter}
        disabled={!canEdit}
        title={t('toolbar.align_center')}
      >
        <AlignCenter />
      </Button>
      <Button
        type="button"
        $pressed={properties.horizontalAlign === 'right'}
        onClick={properties.onToggleHorizontalAlignRight}
        disabled={!canEdit}
        title={t('toolbar.align_right')}
      >
        <AlignRight />
      </Button>
      <Button
        type="button"
        $pressed={properties.verticalAlign === 'top'}
        onClick={properties.onToggleVerticalAlignTop}
        disabled={!canEdit}
        title={t('toolbar.vertical_align_top')}
      >
        <ArrowUpToLine />
      </Button>
      <Button
        type="button"
        $pressed={properties.verticalAlign === 'center'}
        onClick={properties.onToggleVerticalAlignCenter}
        disabled={!canEdit}
        title={t('toolbar.vertical_align_center')}
      >
        <ArrowMiddleFromLine />
      </Button>
      <Button
        type="button"
        $pressed={properties.verticalAlign === 'bottom'}
        onClick={properties.onToggleVerticalAlignBottom}
        disabled={!canEdit}
        title={t('toolbar.vertical_align_bottom')}
      >
        <ArrowDownToLine />
      </Button>
      <Divider />
      <Button
        type="button"
        $pressed={false}
        onClick={() => setBorderPickerOpen(true)}
        ref={borderButton}
        disabled={!canEdit}
        title={t('toolbar.borders')}
      >
        <Grid2X2 />
      </Button>
      <ColorPicker
        color={fontColor}
        onChange={(color): void => {
          properties.onTextColorPicked(color);
          setFontColorPickerOpen(false);
        }}
        anchorEl={fontColorButton}
        open={fontColorPickerOpen}
      />
      <ColorPicker
        color={fillColor}
        onChange={(color): void => {
          properties.onFillColorPicked(color);
          setFillColorPickerOpen(false);
        }}
        anchorEl={fillColorButton}
        open={fillColorPickerOpen}
      />
      <BorderPicker
        onChange={(border): void => {
          properties.onBorderChanged(border);
          setBorderPickerOpen(false);
        }}
        anchorEl={borderButton}
        open={borderPickerOpen}
      />
    </ToolbarContainer>
  );
}
const toolbarHeight = 40;

const ToolbarContainer = styled('div')`
  display: flex;
  flex-shrink: 0;
  flex-grow: row;
  align-items: center;
  background: ${({ theme }) => theme.palette.background.paper};
  height: ${toolbarHeight}px;
  line-height: ${toolbarHeight}px;
  border-bottom: 1px solid ${({ }) => theme.palette.grey['600']};
  font-family: Inter;
  border-radius: 4px 4px 0px 0px;
`;

type TypeButtonProperties = { $pressed: boolean; $underlinedColor?: string };
const Button = styled('button')<TypeButtonProperties>(
  ({ disabled, $pressed, $underlinedColor }) => {
    let result: Record<string, any> = {
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    border: '0px solid #fff',
    borderRadius: '2px',
    marginRight: '5px',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backgroundColor: 'white',
    padding: '0px'
  };
  if (disabled) {
    result.color = theme.palette.grey['600'];
    result.cursor = 'default';
  } else {
    result.borderTop = $underlinedColor ? '3px solid #FFF' : 'none';
    result.borderBottom = $underlinedColor ? `3px solid ${$underlinedColor}` : 'none';
    result.color = '#21243A', //theme.palette.text.primary;
    result.backgroundColor = $pressed ? theme.palette.grey['600'] : '#FFF';
    result['&:hover'] =  {
      backgroundColor: '#F1F2F8',
      borderTopColor: '#F1F2F8'
    }
  }
  result["svg"] = {
    width: "16px",
    height: "16px",
  };
  return result;
});

const Divider = styled('div')({
  width: '0px',
  height: '10px',
  borderLeft: '1px solid #D3D6E9',
  marginLeft: '5px',
  marginRight: '10px',
});

export default Toolbar;
