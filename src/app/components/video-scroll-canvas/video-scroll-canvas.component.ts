import { 
  Component, 
  ElementRef, 
  OnInit, 
  AfterViewInit, 
  OnDestroy, 
  ViewChild, 
  Output, 
  EventEmitter, 
  Inject, 
  PLATFORM_ID 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES_PER_VIDEO = 48;

@Component({
  selector: 'app-video-scroll-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Advanced Luxury Experience Loader (Fullscreen determinate mode) -->
    <div *ngIf="!loaded" class="luxury-experience-loader fullscreen">
      <div class="loader-logo-container">
        <!-- Watercolor SVG Accent -->
        <svg class="loader-logo-svg" viewBox="0 0 600 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="loader-watercolor-gradient-canvas" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#F4A261" stop-opacity="0.85"/>
              <stop offset="30%" stop-color="#E76F51" stop-opacity="0.95"/>
              <stop offset="65%" stop-color="#F38E75" stop-opacity="0.88"/>
              <stop offset="100%" stop-color="#B84F7D" stop-opacity="0.9"/>
              <animate attributeName="x1" dur="4s" values="0%;50%;0%" repeatCount="indefinite" />
              <animate attributeName="x2" dur="4s" values="100%;150%;100%" repeatCount="indefinite" />
            </linearGradient>
            <filter id="loader-paint-bleed-canvas">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise">
                <animate attributeName="baseFrequency" dur="6s" values="0.012;0.022;0.012" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="1.2" />
            </filter>
          </defs>
          <g filter="url(#loader-paint-bleed-canvas)">
            <path d="M 40,88 C 110,65 230,78 350,70 C 470,62 520,78 560,88 C 575,92 570,102 555,108 C 510,128 390,122 280,128 C 170,134 90,118 45,108 C 30,105 30,92 40,88 Z" fill="url(#loader-watercolor-gradient-canvas)" />
          </g>
        </svg>
        <div class="loader-logo-text">Picks&amp;More</div>
      </div>
      <div class="loader-subtitle">Luxury Women &amp; Baby Boutique</div>
      <div class="loader-bar-container">
        <div class="loader-bar-fill-determinate" [style.width.%]="loadingProgress"></div>
      </div>
      <div class="loader-status">Loading matrix: {{ loadingProgress }}%</div>
    </div>

    <!-- Background canvas -->
    <canvas
      #scrollCanvas
      class="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[-2] object-cover"
    ></canvas>
  `,
  styles: [`
    :host {
      display: block;
    }
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2;
      object-fit: cover;
    }
  `]
})
export class VideoScrollCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() loadComplete = new EventEmitter<void>();
  @Output() progressUpdate = new EventEmitter<number>();

  loaded = false;
  loadingProgress = 0;
  private images: HTMLImageElement[] = [];
  private resizeListener?: () => void;
  private scrollTween?: gsap.core.Tween;
  private currentFrameIndex = 0;

  // Mouse deflection coordinates
  private mouseX = -1;
  private mouseY = -1;

  private onCanvasMouseMove = (e: MouseEvent) => {
    if (isPlatformBrowser(this.platformId) && this.canvasRef && this.canvasRef.nativeElement) {
      if (typeof document !== 'undefined' && document.body.classList.contains('intro-running')) {
        this.mouseX = -1;
        this.mouseY = -1;
        return;
      }
      const canvas = this.canvasRef.nativeElement;
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.drawFrame(this.currentFrameIndex, canvas, ctx);
      }
    }
  };

  private onCanvasMouseLeave = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.mouseX = -1;
      this.mouseY = -1;
      
      if (this.canvasRef && this.canvasRef.nativeElement) {
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          this.drawFrame(this.currentFrameIndex, canvas, ctx);
        }
      }
    }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.preloadImages();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (isPlatformBrowser(this.platformId) && this.canvasRef && this.canvasRef.nativeElement) {
      const canvas = this.canvasRef.nativeElement;
      canvas.removeEventListener('mousemove', this.onCanvasMouseMove);
      canvas.removeEventListener('mouseleave', this.onCanvasMouseLeave);
    }
    if (this.scrollTween) {
      this.scrollTween.kill();
      if (this.scrollTween.scrollTrigger) {
        this.scrollTween.scrollTrigger.kill();
      }
    }
  }

  private getFramePath(index: number): string {
    // 0-47: handbag
    // 48-95: loop
    // 96-143: dress
    // 144-191: sneaker
    // 192-239: diaper_bag
    let folder = '';
    let localIndex = 0;

    if (index < 48) {
      folder = 'handbag';
      localIndex = index + 1;
    } else if (index < 96) {
      folder = 'loop';
      localIndex = (index - 48) + 1;
    } else if (index < 144) {
      folder = 'dress';
      localIndex = (index - 96) + 1;
    } else if (index < 192) {
      folder = 'sneaker';
      localIndex = (index - 144) + 1;
    } else {
      folder = 'diaper_bag';
      localIndex = (index - 192) + 1;
    }

    const paddedIndex = String(localIndex).padStart(2, '0');
    return `/frames/${folder}/frame_${paddedIndex}.webp?v=8`;
  }

  private preloadImages(): void {
    const totalFrames = TOTAL_FRAMES_PER_VIDEO * 5; // 5 videos × 48 frames
    
    // First frames of the 5 sequences: index 0, 48, 96, 144, 192
    const placeholderIndices = [0, 48, 96, 144, 192];
    let placeholdersLoaded = 0;
    const totalPlaceholders = placeholderIndices.length;

    // Pre-initialize the images array with Image objects
    this.images = [];
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      this.images.push(img);
    }

    const handlePlaceholderLoad = (index: number) => {
      placeholdersLoaded++;
      this.loadingProgress = Math.round((placeholdersLoaded / totalPlaceholders) * 100);

      if (placeholdersLoaded === totalPlaceholders) {
        this.loaded = true;
        this.loadComplete.emit();
        setTimeout(() => {
          this.initializeCanvas();
          // Stream the rest of the frames in the background
          this.startBackgroundQueue(placeholderIndices);
        }, 50);
      }
    };

    // Load only the placeholder images first
    placeholderIndices.forEach(idx => {
      const img = this.images[idx];
      const path = this.getFramePath(idx);
      img.src = path;
      img.onload = () => handlePlaceholderLoad(idx);
      img.onerror = () => {
        handlePlaceholderLoad(idx);
      };
    });
  }

  private startBackgroundQueue(excludeIndices: number[]): void {
    const totalFrames = TOTAL_FRAMES_PER_VIDEO * 5;
    const remainingIndices: number[] = [];

    for (let i = 0; i < totalFrames; i++) {
      if (!excludeIndices.includes(i)) {
        remainingIndices.push(i);
      }
    }

    // Load remaining frames asynchronously in background batches to keep main thread free
    setTimeout(() => {
      this.loadBatch(remainingIndices, 0);
    }, 500);
  }

  private loadBatch(indices: number[], startIndex: number): void {
    const batchSize = 4;
    const endIndex = Math.min(startIndex + batchSize, indices.length);

    if (startIndex >= indices.length) {
      return;
    }

    const promises = [];
    for (let i = startIndex; i < endIndex; i++) {
      const idx = indices[i];
      const img = this.images[idx];
      const path = this.getFramePath(idx);

      const p = new Promise<void>((resolve) => {
        img.src = path;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      promises.push(p);
    }

    Promise.all(promises).then(() => {
      // Schedule next batch loading after a small delay
      setTimeout(() => {
        this.loadBatch(indices, endIndex);
      }, 50);
    });
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.resizeCanvas(canvas);
    this.drawFrame(0, canvas, ctx);

    // Attach mouse interaction events for Deflection Field
    canvas.addEventListener('mousemove', this.onCanvasMouseMove);
    canvas.addEventListener('mouseleave', this.onCanvasMouseLeave);

    this.resizeListener = () => {
      this.resizeCanvas(canvas);
      this.drawFrame(this.currentFrameIndex, canvas, ctx);
    };
    window.addEventListener('resize', this.resizeListener);

    const scrollObj = { progress: 0 };
    
    // Create a GSAP Timeline bound to the scroll of #scroll-trigger-container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-trigger-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    // 1. Scrub canvas progress on the timeline
    tl.to(scrollObj, {
      progress: 1,
      ease: 'none',
      duration: 1.0, // timeline duration mapping (0 to 1)
      onUpdate: () => {
        if (typeof document !== 'undefined' && document.body.classList.contains('accessibility-freeze-motion')) {
          this.currentFrameIndex = 0;
          this.drawFrame(0, canvas, ctx);
          return;
        }
        const progress = scrollObj.progress;
        this.progressUpdate.emit(progress);
        let frameIndex = 0;

        if (progress < 0.20) {
          // Section 1: Welcome (0% to 20% scroll progress) -> handbag (0-47)
          const localProgress = progress / 0.20;
          frameIndex = Math.round(0 + localProgress * 47);
        } else if (progress < 0.40) {
          // Section 2: Bags & Shoes (20% to 40% scroll progress) -> loop (48-95)
          const localProgress = (progress - 0.20) / 0.20;
          frameIndex = Math.round(48 + localProgress * (95 - 48));
        } else if (progress < 0.60) {
          // Section 3: Apparel (40% to 60% scroll progress) -> dress (96-143)
          const localProgress = (progress - 0.40) / 0.20;
          frameIndex = Math.round(96 + localProgress * (143 - 96));
        } else if (progress < 0.80) {
          // Section 4: Kids Shoes (60% to 80% scroll progress) -> sneaker (144-191)
          const localProgress = (progress - 0.60) / 0.20;
          frameIndex = Math.round(144 + localProgress * (191 - 144));
        } else {
          // Section 5: Mothers & Children (80% to 100% scroll progress) -> diaper_bag (192-239)
          const localProgress = (progress - 0.80) / 0.20;
          frameIndex = Math.round(192 + localProgress * (239 - 192));
        }

        this.currentFrameIndex = frameIndex;
        this.drawFrame(frameIndex, canvas, ctx);
      }
    }, 0);

    // 2. Animate Section overlays opacity and pointer-events natively in the timeline
    // This implements absolute layout synchronization and resolves ghost text overlaps!
    
    // Initially: Section 0 is visible, others are hidden
    gsap.set('.welcome-content-container, .welcome-scroll-indicator', { opacity: 1, pointerEvents: 'auto' });
    gsap.set('#overlay-section-1', { opacity: 0, pointerEvents: 'none' });
    gsap.set('#overlay-section-2', { opacity: 0, pointerEvents: 'none' });
    gsap.set('#overlay-section-3', { opacity: 0, pointerEvents: 'none' });
    gsap.set('#overlay-section-4', { opacity: 0, pointerEvents: 'none' });

    // Section 0 (Welcome) Content fades out from progress 0.13 to 0.18 (well before segment 2 starts)
    tl.to('.welcome-content-container, .welcome-scroll-indicator', { 
      opacity: 0, 
      pointerEvents: 'none',
      duration: 0.05 
    }, 0.13);

    // Section 1 (Bags & Shoes) fades in at 0.20 to 0.23, and fades out at 0.34 to 0.39
    tl.fromTo('#overlay-section-1', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.03, ease: 'power1.out' }, 
      0.20
    );
    tl.to('#overlay-section-1', { 
      opacity: 0, 
      y: -30,
      pointerEvents: 'none',
      duration: 0.05,
      ease: 'power1.in'
    }, 0.34);

    // Section 2 (Clothing) fades in at 0.40 to 0.43, and fades out at 0.54 to 0.59
    tl.fromTo('#overlay-section-2', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.03, ease: 'power1.out' }, 
      0.40
    );
    tl.to('#overlay-section-2', { 
      opacity: 0, 
      y: -30,
      pointerEvents: 'none',
      duration: 0.05,
      ease: 'power1.in'
    }, 0.54);

    // Section 3 (Kids Shoes) fades in at 0.60 to 0.63, and fades out at 0.74 to 0.79
    tl.fromTo('#overlay-section-3', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.03, ease: 'power1.out' }, 
      0.60
    );
    tl.to('#overlay-section-3', { 
      opacity: 0, 
      y: -30,
      pointerEvents: 'none',
      duration: 0.05,
      ease: 'power1.in'
    }, 0.74);

    // Section 4 (Mothers & Children) fades in at 0.80 to 0.83, and remains active to the end
    tl.fromTo('#overlay-section-4', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.03, ease: 'power1.out' }, 
      0.80
    );
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    // Guarantee canvas backing store size matches layout dimensions exactly
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
  }

  private drawActualImage(
    img: HTMLImageElement,
    safeWidth: number,
    safeHeight: number,
    ctx: CanvasRenderingContext2D,
    index: number
  ): void {
    const imgWidth = img.naturalWidth || img.width || 1920;
    const imgHeight = img.naturalHeight || img.height || 1000;
    
    const safeImgWidth = imgWidth > 0 ? imgWidth : 1920;
    const safeImgHeight = imgHeight > 0 ? imgHeight : 1000;

    const imgRatio = safeImgWidth / safeImgHeight;
    const canvasRatio = safeWidth / safeHeight;

    let drawWidth = 1920;
    let drawHeight = 1080;
    let drawX = 0;
    let drawY = 0;

    if (canvasRatio > imgRatio) {
      // Screen is wider than image -> cover width, crop height
      drawWidth = safeWidth;
      drawHeight = safeWidth / imgRatio;
      drawX = 0;
      drawY = (safeHeight - drawHeight) / 2;
    } else {
      // Screen is taller than image -> cover height, crop width
      drawWidth = safeHeight * imgRatio;
      drawHeight = safeHeight;
      drawX = (safeWidth - drawWidth) / 2;
      drawY = 0;
    }

    // Safeguard aspect ratio calculations to not result in NaN or Infinity
    if (isNaN(drawWidth) || isNaN(drawHeight) || isNaN(drawX) || isNaN(drawY) || 
        !isFinite(drawWidth) || !isFinite(drawHeight) || !isFinite(drawX) || !isFinite(drawY)) {
      console.warn(`[Canvas] Invalid dimensions computed:`, { drawWidth, drawHeight, drawX, drawY });
      drawWidth = safeWidth;
      drawHeight = safeHeight;
      drawX = 0;
      drawY = 0;
    }

    try {
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } catch (err) {
      console.error(`[Canvas] Error drawing frame ${index}:`, err);
    }
  }

  private drawFrame(index: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    let targetIndex = index;
    if (typeof document !== 'undefined' && document.body.classList.contains('accessibility-freeze-motion')) {
      targetIndex = 0;
    }
    const img = this.images[targetIndex];
    
    // Safely capture canvas/window dimensions
    const width = canvas.width || (typeof window !== 'undefined' ? window.innerWidth : 1920);
    const height = canvas.height || (typeof window !== 'undefined' ? window.innerHeight : 1080);
    
    const safeWidth = width > 0 ? width : 1920;
    const safeHeight = height > 0 ? height : 1080;

    // Clear background with solid color fallback first
    ctx.fillStyle = '#FBF9F6';
    ctx.fillRect(0, 0, safeWidth, safeHeight);

    // Verify if image is fully loaded and valid
    const isImageValid = img && img.complete && (img.naturalWidth || img.width) > 0;
    if (isImageValid) {
      this.drawActualImage(img, safeWidth, safeHeight, ctx, targetIndex);
    } else {
      // Find the placeholder for this sequence
      let placeholderIndex = 0;
      if (targetIndex < 48) {
        placeholderIndex = 0;
      } else if (targetIndex < 96) {
        placeholderIndex = 48;
      } else if (targetIndex < 144) {
        placeholderIndex = 96;
      } else if (targetIndex < 192) {
        placeholderIndex = 144;
      } else {
        placeholderIndex = 192;
      }

      const placeholderImg = this.images[placeholderIndex];
      const isPlaceholderValid = placeholderImg && placeholderImg.complete && (placeholderImg.naturalWidth || placeholderImg.width) > 0;

      if (isPlaceholderValid) {
        this.drawActualImage(placeholderImg, safeWidth, safeHeight, ctx, placeholderIndex);
      } else {
        ctx.fillStyle = '#2A2522';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`[Missing/Loading Frame ${index}]`, safeWidth / 2, safeHeight / 2);
      }
    }

    // Apply local deflection warp around mouse position
    if (this.mouseX >= 0 && this.mouseY >= 0) {
      const radius = 100;
      const strength = 0.15;
      
      const x_min = Math.max(0, Math.floor(this.mouseX - radius));
      const x_max = Math.min(safeWidth - 1, Math.floor(this.mouseX + radius));
      const y_min = Math.max(0, Math.floor(this.mouseY - radius));
      const y_max = Math.min(safeHeight - 1, Math.floor(this.mouseY + radius));
      
      const w_roi = x_max - x_min + 1;
      const h_roi = y_max - y_min + 1;
      
      if (w_roi > 0 && h_roi > 0) {
        try {
          // Grab the pixels around the mouse
          const imgData = ctx.getImageData(x_min, y_min, w_roi, h_roi);
          const pixels = imgData.data;
          
          // Create a buffer to read warped pixels from
          const buffer = new Uint8ClampedArray(pixels);
          
          // Center relative coordinates in the ROI
          const centerX = this.mouseX - x_min;
          const centerY = this.mouseY - y_min;
          
          for (let y = 0; y < h_roi; y++) {
            const dy = y - centerY;
            const dy_sq = dy * dy;
            
            for (let x = 0; x < w_roi; x++) {
              const dx = x - centerX;
              const dist_sq = dx * dx + dy_sq;
              
              if (dist_sq < radius * radius) {
                const dist = Math.sqrt(dist_sq);
                const t = dist / radius;
                // Deflection push factor: pushes pixels away from center
                const factor = (1 - t) * (1 - t) * strength;
                
                const srcX = x + dx * factor;
                const srcY = y + dy * factor;
                
                // Bilinear interpolation for smooth warp
                const x0 = Math.floor(srcX);
                const x1 = Math.min(w_roi - 1, x0 + 1);
                const y0 = Math.floor(srcY);
                const y1 = Math.min(h_roi - 1, y0 + 1);
                
                const tx = srcX - x0;
                const ty = srcY - y0;
                
                const idx00 = (y0 * w_roi + x0) * 4;
                const idx10 = (y0 * w_roi + x1) * 4;
                const idx01 = (y1 * w_roi + x0) * 4;
                const idx11 = (y1 * w_roi + x1) * 4;
                
                const targetIdx = (y * w_roi + x) * 4;
                
                for (let c = 0; c < 3; c++) {
                  const val00 = buffer[idx00 + c];
                  const val10 = buffer[idx10 + c];
                  const val01 = buffer[idx01 + c];
                  const val11 = buffer[idx11 + c];
                  
                  // Interpolate horizontally
                  const val0 = val00 + tx * (val10 - val00);
                  const val1 = val01 + tx * (val11 - val01);
                  // Interpolate vertically
                  const val = val0 + ty * (val1 - val0);
                  
                  pixels[targetIdx + c] = val;
                }
                // Keep alpha 255
                pixels[targetIdx + 3] = buffer[targetIdx + 3];
              }
            }
          }
          ctx.putImageData(imgData, x_min, y_min);
        } catch (err) {
          // Fallback if getImageData fails or is restricted (e.g. cross-origin canvas)
          // We fail silently
        }
      }
    }

    // Dissolve transition removed to keep continuous loop movement clean
  }
}
