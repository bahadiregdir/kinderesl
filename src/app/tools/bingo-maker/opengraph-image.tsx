import { getToolConfig } from '@/data/tools';
import {
  TOOL_OG_CONTENT_TYPE,
  TOOL_OG_SIZE,
  renderToolOgImage,
} from '@/lib/tool-og-image';

const TOOL_SLUG = 'bingo-maker';

export const alt = getToolConfig(TOOL_SLUG).ogAlt;
export const size = TOOL_OG_SIZE;
export const contentType = TOOL_OG_CONTENT_TYPE;

export default function BingoMakerOpenGraphImage() {
  return renderToolOgImage(TOOL_SLUG);
}
