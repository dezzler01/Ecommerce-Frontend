import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FloatingItem {
  id: number;
  emoji: string;
  size: number;       // px
  left: string;       // CSS %
  startY: number;     // vh offset at top
  scrollSpeed: number; // multiplier for scroll distance
  rotateSpeed: number; // degrees of rotation over full scroll
  delay: number;       // animation stagger delay
  bobAmplitude: number;// px for idle float
  bobDuration: number; // seconds for idle float cycle
  opacity: number;
  blur: number;        // px blur for depth
  zIndex: number;
}

@Component({
  selector: 'app-floating-3d-decor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-3d-canvas" aria-hidden="true">
      <div *ngFor="let item of items"
           class="floating-3d-item"
           [attr.data-id]="item.id"
           [ngStyle]="{
             'left': item.left,
             'top': item.startY + 'vh',
             'font-size': item.size + 'px',
             'opacity': item.opacity,
             'filter': 'blur(' + item.blur + 'px)',
             'z-index': item.zIndex
           }">
        {{ item.emoji }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 15;
      overflow: hidden;
    }

    .floating-3d-canvas {
      position: absolute;
      inset: 0;
      perspective: 1200px;
      perspective-origin: 50% 50%;
    }

    .floating-3d-item {
      position: absolute;
      transform-style: preserve-3d;
      will-change: transform, opacity;
      line-height: 1;
      user-select: none;
      pointer-events: none;
      text-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    @media (prefers-reduced-motion: reduce) {
      .floating-3d-item {
        animation: none !important;
        transform: none !important;
        opacity: 0.3 !important;
      }
    }

    /* Hide on small screens for performance */
    @media (max-width: 640px) {
      :host {
        display: none;
      }
    }
  `]
})
export class Floating3dDecorComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private elRef = inject(ElementRef);
  private ctx!: gsap.Context;

  items: FloatingItem[] = [
    // ─── Layer 1: Deep background (blurred, slow) ───
    { id: 1,  emoji: '🎈', size: 38, left: '8%',  startY: 25,  scrollSpeed: 0.3, rotateSpeed: 60,  delay: 0,   bobAmplitude: 12, bobDuration: 5.5, opacity: 0.25, blur: 2.5, zIndex: 1 },
    { id: 2,  emoji: '⭐', size: 24, left: '88%', startY: 55,  scrollSpeed: 0.25,rotateSpeed: -90, delay: 0.8, bobAmplitude: 8,  bobDuration: 6.0, opacity: 0.2,  blur: 3,   zIndex: 1 },
    { id: 3,  emoji: '☁️', size: 42, left: '72%', startY: 15,  scrollSpeed: 0.2, rotateSpeed: 20,  delay: 1.2, bobAmplitude: 10, bobDuration: 7.0, opacity: 0.18, blur: 3,   zIndex: 1 },

    // ─── Layer 2: Midground (moderate blur, medium speed) ───
    { id: 4,  emoji: '🧸', size: 32, left: '18%', startY: 65,  scrollSpeed: 0.5, rotateSpeed: -45, delay: 0.3, bobAmplitude: 14, bobDuration: 4.5, opacity: 0.3,  blur: 1.5, zIndex: 2 },
    { id: 5,  emoji: '🎀', size: 28, left: '92%', startY: 35,  scrollSpeed: 0.45,rotateSpeed: 80,  delay: 0.6, bobAmplitude: 10, bobDuration: 5.0, opacity: 0.28, blur: 1.5, zIndex: 2 },
    { id: 6,  emoji: '💛', size: 22, left: '50%', startY: 80,  scrollSpeed: 0.55,rotateSpeed: -120,delay: 1.0, bobAmplitude: 8,  bobDuration: 4.0, opacity: 0.25, blur: 1,   zIndex: 2 },
    { id: 7,  emoji: '🌸', size: 26, left: '35%', startY: 10,  scrollSpeed: 0.4, rotateSpeed: 50,  delay: 1.5, bobAmplitude: 12, bobDuration: 5.5, opacity: 0.22, blur: 2,   zIndex: 2 },

    // ─── Layer 3: Foreground (sharp, fast, larger) ───
    { id: 8,  emoji: '🎈', size: 44, left: '78%', startY: 45,  scrollSpeed: 0.7, rotateSpeed: -35, delay: 0.2, bobAmplitude: 18, bobDuration: 3.8, opacity: 0.35, blur: 0,   zIndex: 3 },
    { id: 9,  emoji: '⭐', size: 30, left: '5%',  startY: 70,  scrollSpeed: 0.65,rotateSpeed: 100, delay: 0.9, bobAmplitude: 15, bobDuration: 4.2, opacity: 0.32, blur: 0,   zIndex: 3 },
    { id: 10, emoji: '🦋', size: 28, left: '62%', startY: 90,  scrollSpeed: 0.75,rotateSpeed: -70, delay: 1.3, bobAmplitude: 20, bobDuration: 3.5, opacity: 0.3,  blur: 0,   zIndex: 3 },

    // ─── Extra accents ───
    { id: 11, emoji: '✨', size: 18, left: '42%', startY: 40,  scrollSpeed: 0.35,rotateSpeed: 150, delay: 0.4, bobAmplitude: 6,  bobDuration: 3.0, opacity: 0.2,  blur: 1,   zIndex: 2 },
    { id: 12, emoji: '🎈', size: 30, left: '25%', startY: 50,  scrollSpeed: 0.6, rotateSpeed: -55, delay: 1.8, bobAmplitude: 16, bobDuration: 4.8, opacity: 0.28, blur: 0.5, zIndex: 3 },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ctx = gsap.context(() => {

      this.items.forEach((item) => {
        const el = this.elRef.nativeElement.querySelector(`[data-id="${item.id}"]`);
        if (!el) return;

        // ── 1. Continuous idle bob (floating feel) ──
        gsap.to(el, {
          y: `+=${item.bobAmplitude}`,
          duration: item.bobDuration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: item.delay
        });

        // ── 2. Slow continuous 3D rotation ──
        gsap.to(el, {
          rotateY: item.rotateSpeed > 0 ? 15 : -15,
          rotateX: item.rotateSpeed > 0 ? 8 : -8,
          duration: item.bobDuration * 1.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: item.delay * 0.5
        });

        // ── 3. Scroll-linked vertical drift ──
        gsap.to(el, {
          y: () => -(item.scrollSpeed * window.innerHeight * 1.2),
          rotateZ: item.rotateSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5
          }
        });

        // ── 4. Entrance fade-in from below ──
        gsap.fromTo(el,
          { opacity: 0, scale: 0.5, rotateZ: item.rotateSpeed * 0.1 },
          {
            opacity: item.opacity,
            scale: 1,
            rotateZ: 0,
            duration: 1.5,
            delay: item.delay,
            ease: 'elastic.out(1, 0.8)'
          }
        );
      });

    }, this.elRef.nativeElement);
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }
}
