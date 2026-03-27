const CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME ?? 'demo';
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export interface TransformOptions {
  crop?: 'fill' | 'thumb' | 'crop' | 'auto' | 'limit' | 'scale';
  gravity?: string;
  width?: number;
  height?: number;
  aspect?: string;
  namedTransform?: string;
}

/**
 * Build a single Cloudinary delivery URL.
 * One action parameter per component; format and quality in their own components.
 */
export function cloudinaryUrl(publicId: string, opts: TransformOptions = {}): string {
  if (opts.namedTransform) {
    return `${BASE}/t_${opts.namedTransform}/f_auto/q_auto:best/${publicId}`;
  }

  const parts: string[] = [];
  const crop = opts.crop ?? 'scale';
  const actionParts = [`c_${crop}`];
  if (opts.gravity && crop !== 'scale') actionParts.push(`g_${opts.gravity}`);
  if (opts.width) actionParts.push(`w_${opts.width}`);
  if (opts.height) actionParts.push(`h_${opts.height}`);
  if (opts.aspect) actionParts.push(`ar_${opts.aspect}`);
  actionParts.sort();
  parts.push(actionParts.join(','));

  parts.push('f_auto');
  parts.push('q_auto:best');

  return `${BASE}/${parts.join('/')}/${publicId}`;
}

export interface CropRegion {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

/**
 * Build a Cloudinary URL that crops a region from the source, then scales to display width.
 * Two chained actions: c_crop (extract region) → c_scale (fit to screen).
 */
export function cloudinaryCropUrl(
  publicId: string,
  crop: CropRegion,
  displayWidth: number = 1200,
): string {
  const parts = [
    `c_crop,g_xy_center,h_${Math.round(crop.height)},w_${Math.round(crop.width)},x_${Math.round(crop.centerX)},y_${Math.round(crop.centerY)}`,
    `c_scale,w_${displayWidth}`,
    'f_auto',
    'q_auto:best',
  ];
  return `${BASE}/${parts.join('/')}/${publicId}`;
}

const BREAKPOINTS = [480, 768, 1024, 1440, 1920];

/**
 * Generate a srcset string for responsive images.
 * Each breakpoint gets its own delivery URL at that width.
 */
export function cloudinarySrcset(publicId: string, opts: Omit<TransformOptions, 'width'> = {}): string {
  return BREAKPOINTS
    .map((w) => `${cloudinaryUrl(publicId, { ...opts, width: w })} ${w}w`)
    .join(', ');
}

/** Reasonable default sizes attribute for full-width imagery. */
export const DEFAULT_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1440px';
