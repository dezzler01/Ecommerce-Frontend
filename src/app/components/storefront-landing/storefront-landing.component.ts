import { Component, inject, PLATFORM_ID, OnInit, AfterViewInit, OnDestroy, ElementRef, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WelcomeSectionComponent } from '../welcome-section/welcome-section.component';
import { Floating3dDecorComponent } from '../floating-3d-decor/floating-3d-decor.component';
import { CatalogService, Brand } from '../../core/services/catalog.service';
import { AlertService } from '../../services/alert.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-storefront-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WelcomeSectionComponent,
    Floating3dDecorComponent
  ],
  template: `
    <!-- Natural scrolling container with unified background canvas -->
    <div class="relative w-full overflow-x-hidden flex flex-col text-[var(--text-charcoal)] storefront-unified-canvas">
      <!-- Global subtle vignette backdrop overlay -->
      <div class="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[var(--text-charcoal)]/3 via-transparent to-[var(--text-charcoal)]/8 mix-blend-multiply opacity-20"></div>

      <!-- 3D Floating Decorative Elements -->
      <app-floating-3d-decor></app-floating-3d-decor>

      <!-- Hero Section -->
      <app-welcome-section class="w-full relative z-20 animate-fade-in"></app-welcome-section>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- SECTION A: Shop by Category — Playful Pastel Grid      -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <section id="sf-categories" class="w-full py-10 sm:py-14 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent">
        <div class="sf-section-header text-center mb-8 sm:mb-10">
          <span class="sf-section-label">Explore Our World</span>
          <h2 class="sf-section-title">Shop by Category</h2>
          <p class="sf-section-sub">Everything your little one needs — all in one place</p>
        </div>

        <div class="sf-cat-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">

          <!-- Card: Baby Clothes -->
          <a routerLink="/products" [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }"
             class="sf-cat-card group" style="--card-bg: #FFF0ED;">
            <div class="sf-cat-icon-wrap" style="background: #FDDDD6;">
              <img src="/products/infant_dress.png" alt="Baby Clothes" class="sf-cat-img" />
            </div>
            <span class="sf-cat-name">Baby Clothes</span>
            <span class="sf-cat-arrow group-hover:translate-x-1">→</span>
          </a>

          <!-- Card: Toys & Games -->
          <a routerLink="/products" [queryParams]="{ target: 'Kids', subcategory: 'toys & games' }"
             class="sf-cat-card group" style="--card-bg: #E8F6FD;">
            <div class="sf-cat-icon-wrap" style="background: #CCECF9;">
              <img src="/products/plush_bunny.png" alt="Toys & Games" class="sf-cat-img" />
            </div>
            <span class="sf-cat-name">Toys & Games</span>
            <span class="sf-cat-arrow group-hover:translate-x-1">→</span>
          </a>

          <!-- Card: Women's Fashion -->
          <a routerLink="/products" [queryParams]="{ target: 'Women' }"
             class="sf-cat-card group" style="--card-bg: #FDF4E7;">
            <div class="sf-cat-icon-wrap" style="background: #FAE5C4;">
              <img src="/products/handbag.png" alt="Women's Fashion" class="sf-cat-img" />
            </div>
            <span class="sf-cat-name">Women</span>
            <span class="sf-cat-arrow group-hover:translate-x-1">→</span>
          </a>

          <!-- Card: Baby Essentials -->
          <a routerLink="/products" [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }"
             class="sf-cat-card group" style="--card-bg: #F0FAF0;">
            <div class="sf-cat-icon-wrap" style="background: #D4F0D4;">
              <img src="/products/baby_bottle.png" alt="Baby Essentials" class="sf-cat-img" />
            </div>
            <span class="sf-cat-name">Essentials</span>
            <span class="sf-cat-arrow group-hover:translate-x-1">→</span>
          </a>

          <!-- Card: Kids Shoes -->
          <a routerLink="/products" [queryParams]="{ target: 'Kids', subcategory: 'shoes' }"
             class="sf-cat-card group" style="--card-bg: #F3EEFA;">
            <div class="sf-cat-icon-wrap" style="background: #E0D0F5;">
              <img src="/products/baby_clogs.png" alt="Kids Shoes" class="sf-cat-img" />
            </div>
            <span class="sf-cat-name">Kids Shoes</span>
            <span class="sf-cat-arrow group-hover:translate-x-1">→</span>
          </a>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- SECTION B: Collection Showcase — Two Feature Panels     -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <section id="sf-collections" class="w-full py-6 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent">
        <div class="sf-duo-grid">

          <!-- Panel 1: Little One Collection -->
          <div class="sf-panel group">
            <div class="sf-panel-bg" style="background-image: url('/products/little_one_collection_perfect.png');"></div>
            <div class="sf-panel-overlay"></div>
            <div class="sf-panel-content">
              <span class="sf-panel-label">Little One</span>
              <h3 class="sf-panel-title font-fredoka">Tiny Styles,<br/>Big Comfort</h3>
              <p class="sf-panel-sub">Soft. Safe. Adorable.</p>
              <a routerLink="/products" [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" class="sf-panel-link">
                Explore Collection <span>→</span>
              </a>
            </div>
            <div class="sf-panel-badge">
              <span class="text-[9px] uppercase tracking-widest text-[#77685D] block">Up to</span>
              <span class="text-[28px] font-bold text-[#F67B63] leading-none font-fredoka">30%</span>
              <span class="text-[9px] uppercase tracking-widest text-[#77685D] block">Off</span>
              <span class="text-[10px] text-[#F67B63] mt-0.5 block">♡</span>
            </div>
          </div>

          <!-- Panel 2: Women Collection -->
          <div class="sf-panel group">
            <div class="sf-panel-bg" style="background-image: url('/products/women_collection_perfect.png');"></div>
            <div class="sf-panel-overlay"></div>
            <div class="sf-panel-content">
              <span class="sf-panel-label">Women</span>
              <h3 class="sf-panel-title font-fredoka">Effortless<br/>Everyday Looks</h3>
              <p class="sf-panel-sub">Timeless pieces for modern moms.</p>
              <a routerLink="/products" [queryParams]="{ target: 'Women' }" class="sf-panel-link">
                Shop Women <span>→</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- SECTION C: Why Families Love Us — Feature Strip         -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <section id="sf-features" class="w-full py-10 sm:py-14 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent">
        <div class="sf-section-header text-center mb-8 sm:mb-10">
          <span class="sf-section-label">Our Promise</span>
          <h2 class="sf-section-title">Why Families Love Us</h2>
        </div>

        <div class="sf-features-grid grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

          <div class="sf-feature-card">
            <div class="sf-feature-icon" style="background: #FFF0ED; color: #F67B63;">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.75A11.952 11.952 0 0012 2.744z" />
              </svg>
            </div>
            <h4 class="sf-feature-title">Curated Quality</h4>
            <p class="sf-feature-desc">Every item is hand-picked and tested for your family's safety and style.</p>
          </div>

          <div class="sf-feature-card">
            <div class="sf-feature-icon" style="background: #E8F6FD; color: #64C9F5;">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h4 class="sf-feature-title">Baby-Safe Materials</h4>
            <p class="sf-feature-desc">Gentle fabrics and BPA-free products that you can trust.</p>
          </div>

          <div class="sf-feature-card">
            <div class="sf-feature-icon" style="background: #F0FAF0; color: #77DCC5;">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v11.177m0-11.177h-1.197a1.875 1.875 0 00-1.582.805l-3 4.2a1.875 1.875 0 00-.281.932v4.062a1.125 1.125 0 001.125 1.125H9.75M8.25 14.25h1.5M16.5 14.25h1.5" />
              </svg>
            </div>
            <h4 class="sf-feature-title">Fast Delivery</h4>
            <p class="sf-feature-desc">Reliable shipping across Egypt — straight to your doorstep.</p>
          </div>

          <div class="sf-feature-card">
            <div class="sf-feature-icon" style="background: #F3EEFA; color: #B99AF7;">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
              </svg>
            </div>
            <h4 class="sf-feature-title">Easy Returns</h4>
            <p class="sf-feature-desc">14-day hassle-free exchange policy on all items.</p>
          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- SECTION D: Men's Coming Soon Teaser Banner              -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <section id="sf-teaser" class="w-full py-6 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent">
        <div class="sf-teaser group">
          <div class="sf-teaser-bg" style="background-image: url('/products/men_collection_perfect.png');"></div>
          <div class="absolute inset-y-0 left-0 z-10 pointer-events-none
                      w-full bg-gradient-to-r from-[#FAF5F2]/70 via-[#FAF5F2]/35 to-transparent
                      sm:w-[75%] md:w-[55%]"></div>
          <div class="sf-teaser-content z-20">
            <span class="sf-panel-label" style="color: #F67B63;">Men's Collection</span>
            <h3 class="sf-panel-title font-fredoka" style="color: var(--text-charcoal);">Coming<br/>Soon</h3>
            <p class="sf-panel-sub" style="color: #77685D;">Sharp silhouettes and contemporary essentials for the modern man.</p>
            <div class="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#F67B63]/70 font-bold cursor-default select-none font-nunito">
              <span>Stay Tuned</span>
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
          </div>
          <div class="sf-panel-badge sf-teaser-badge">
            <span class="text-[9px] uppercase tracking-widest text-[#77685D] block">Men's</span>
            <span class="text-[24px] font-bold text-[#F67B63] leading-none font-fredoka">SOON</span>
            <span class="text-[9px] uppercase tracking-widest text-[#77685D] block">Coming</span>
            <span class="text-[10px] text-[#F67B63] mt-0.5 block">⚡</span>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- Trust Benefits Strip                                     -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <section class="w-full bg-[#F0FAFE] border-t border-[#EBF1F5] py-12 flex items-center justify-center z-10 overflow-hidden select-none pointer-events-auto">
        <div class="w-full px-6 md:px-12 lg:px-24">
          <div class="bb-trust grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">

            <div class="bb-trust-item flex flex-col items-center text-center gap-3">
              <div class="bb-trust-icon w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#EBF1F5] shadow-sm">
                <svg class="w-5 h-5 text-[#F67B63]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[11.5px] text-[var(--text-charcoal)] uppercase tracking-wider font-fredoka">Inspect First</p>
                <p class="bb-trust-sub text-[10px] text-[#77685D] font-semibold font-nunito leading-tight">Inspect before paying</p>
              </div>
            </div>

            <div class="bb-trust-item flex flex-col items-center text-center gap-3">
              <div class="bb-trust-icon w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#EBF1F5] shadow-sm">
                <svg class="w-5 h-5 text-[#64C9F5]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v11.177m0-11.177h-1.197a1.875 1.875 0 00-1.582.805l-3 4.2a1.875 1.875 0 00-.281.932v4.062a1.125 1.125 0 001.125 1.125H9.75M8.25 14.25h1.5M16.5 14.25h1.5" /></svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[11.5px] text-[var(--text-charcoal)] uppercase tracking-wider font-fredoka">Fast Delivery</p>
                <p class="bb-trust-sub text-[10px] text-[#77685D] font-semibold font-nunito leading-tight">All over Egypt</p>
              </div>
            </div>

            <div class="bb-trust-item flex flex-col items-center text-center gap-3">
              <div class="bb-trust-icon w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#EBF1F5] shadow-sm">
                <svg class="w-5 h-5 text-[#FFD75A]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" /></svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[11.5px] text-[var(--text-charcoal)] uppercase tracking-wider font-fredoka">14-Day Exchange</p>
                <p class="bb-trust-sub text-[10px] text-[#77685D] font-semibold font-nunito leading-tight">Hassle-free swap</p>
              </div>
            </div>

            <div class="bb-trust-item flex flex-col items-center text-center gap-3">
              <div class="bb-trust-icon w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#EBF1F5] shadow-sm">
                <svg class="w-5 h-5 text-[#77DCC5]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.75A11.952 11.952 0 0012 2.744z" /></svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[11.5px] text-[var(--text-charcoal)] uppercase tracking-wider font-fredoka">Secure Payment</p>
                <p class="bb-trust-sub text-[10px] text-[#77685D] font-semibold font-nunito leading-tight">Safe transactions</p>
              </div>
            </div>

            <div class="bb-trust-item flex flex-col items-center text-center gap-3">
              <div class="bb-trust-icon w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#EBF1F5] shadow-sm">
                <svg class="w-5 h-5 text-[#64C9F5]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[11.5px] text-[var(--text-charcoal)] uppercase tracking-wider font-fredoka">WhatsApp Help</p>
                <p class="bb-trust-sub text-[10px] text-[#77685D] font-semibold font-nunito leading-tight">24/7 Chat support</p>
              </div>
            </div>

            <div class="bb-trust-item flex flex-col items-center text-center gap-3">
              <div class="bb-trust-icon w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#EBF1F5] shadow-sm">
                <svg class="w-5 h-5 text-[#B99AF7]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[11.5px] text-[var(--text-charcoal)] uppercase tracking-wider font-fredoka">100% Authentic</p>
                <p class="bb-trust-sub text-[10px] text-[#77685D] font-semibold font-nunito leading-tight">Guaranteed original</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    /* ─── Section Headers ─── */
    .sf-section-label {
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
      color: #F67B63; font-weight: 700; display: block; margin-bottom: 6px;
      font-family: var(--font-heading);
    }
    .sf-section-title {
      font-size: 28px; font-weight: 700; color: var(--text-charcoal);
      line-height: 1.2; margin-bottom: 6px; font-family: var(--font-heading);
    }
    @media (min-width: 640px) { .sf-section-title { font-size: 36px; } }
    .sf-section-sub {
      font-size: 14px; color: #77685D; font-weight: 500;
      font-family: var(--font-sans);
    }

    /* ─── Category Cards ─── */
    .sf-cat-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 20px 12px 16px; border-radius: 1.5rem;
      background: var(--card-bg, #FFF0ED);
      border: 1px solid rgba(0,0,0,0.04);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none; cursor: pointer; position: relative;
    }
    .sf-cat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.08);
    }
    .sf-cat-icon-wrap {
      width: 72px; height: 72px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 10px; overflow: hidden;
      transition: transform 0.3s ease;
    }
    .sf-cat-card:hover .sf-cat-icon-wrap { transform: scale(1.08); }
    .sf-cat-img { width: 55%; height: 55%; object-fit: contain; }
    .sf-cat-name {
      font-size: 12px; font-weight: 700; color: var(--text-charcoal);
      text-transform: uppercase; letter-spacing: 0.08em;
      font-family: var(--font-heading); text-align: center;
    }
    .sf-cat-arrow {
      font-size: 14px; color: #F67B63; font-weight: 700;
      margin-top: 4px; transition: transform 0.3s ease;
    }

    /* ─── Collection Duo Grid ─── */
    .sf-duo-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    }
    @media (max-width: 768px) {
      .sf-duo-grid { grid-template-columns: 1fr; }
    }
    .sf-panel {
      position: relative; min-height: 300px; overflow: hidden;
      display: flex; align-items: flex-end;
      border-radius: 2rem; border: 0.5px solid var(--border-delicate);
    }
    .sf-panel-bg {
      position: absolute; top: -15%; bottom: -15%; left: 0; right: 0;
      background-size: cover; background-position: center;
      transition: transform 0.7s ease-out;
      will-change: transform;
    }
    .sf-panel:hover .sf-panel-bg { transform: scale(1.05); }
    .sf-panel-overlay {
      position: absolute; inset: 0; z-index: 2;
      background: linear-gradient(to top, rgba(42,31,26,0.75) 0%, rgba(42,31,26,0.2) 50%, rgba(42,31,26,0.02) 100%);
    }
    .sf-panel-content {
      position: relative; z-index: 3;
      padding: 24px 28px; width: 100%; text-align: left;
    }
    @media (min-width: 768px) { .sf-panel-content { padding: 32px 40px; } }
    .sf-panel-label {
      font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--bg-cheerful-cream); opacity: 0.85; font-weight: 700;
      display: block; margin-bottom: 6px; font-family: var(--font-heading);
    }
    .sf-panel-title {
      font-size: 28px; font-weight: 700; line-height: 1.2;
      margin-bottom: 6px; color: var(--bg-cheerful-cream);
    }
    @media (min-width: 768px) { .sf-panel-title { font-size: 36px; } }
    .sf-panel-sub {
      font-size: 14px; color: rgba(250,246,240,0.8); margin-bottom: 12px;
      font-weight: 500; font-family: var(--font-sans);
    }
    .sf-panel-link {
      font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em;
      color: #FFF; font-weight: 700; cursor: pointer; border: none;
      background: none; font-family: var(--font-heading); padding: 0;
      display: inline-flex; align-items: center; gap: 4px;
      text-decoration: none; border-bottom: 2px solid transparent;
      transition: all 0.3s;
    }
    .sf-panel-link:hover { border-bottom-color: #FFF; transform: translateX(3px); }
    .sf-panel-badge {
      position: absolute; right: 28px; top: 24px; z-index: 20;
      background: rgba(255,253,249,0.92);
      border: 0.5px solid var(--border-delicate);
      border-radius: 16px; padding: 12px 14px;
      text-align: center; min-width: 70px;
      box-shadow: 0 8px 24px rgba(42,31,26,0.06);
    }

    /* ─── Feature Cards ─── */
    .sf-feature-card {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; padding: 24px 16px;
      border-radius: 1.5rem; background: white;
      border: 1px solid rgba(0,0,0,0.04);
      transition: all 0.3s ease;
    }
    .sf-feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
    }
    .sf-feature-icon {
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .sf-feature-title {
      font-size: 13px; font-weight: 700; color: var(--text-charcoal);
      margin-bottom: 4px; font-family: var(--font-heading);
    }
    .sf-feature-desc {
      font-size: 12px; color: #77685D; line-height: 1.5;
      font-family: var(--font-sans); font-weight: 500;
    }

    /* ─── Teaser Banner ─── */
    .sf-teaser {
      position: relative; width: 100%; min-height: 220px; overflow: hidden;
      border-radius: 2rem; border: 0.5px solid var(--border-delicate);
      display: flex; align-items: stretch;
    }
    @media (min-width: 640px) { .sf-teaser { min-height: 260px; } }
    @media (min-width: 1024px) { .sf-teaser { min-height: 300px; } }
    .sf-teaser-bg {
      position: absolute; top: -15%; bottom: -15%; left: 0; right: 0;
      background-size: cover; background-position: center;
      transition: transform 0.7s ease-out;
      will-change: transform;
    }
    .sf-teaser:hover .sf-teaser-bg { transform: scale(1.05); }
    .sf-teaser-content {
      position: relative; z-index: 20;
      padding: 28px 20px; flex: 1;
    }
    @media (min-width: 480px) { .sf-teaser-content { padding: 36px 32px; } }
    @media (min-width: 768px) { .sf-teaser-content { padding: 48px 52px; } }
    .sf-teaser-badge {
      right: 16px; top: 50%; transform: translateY(-50%);
    }
    @media (min-width: 480px) { .sf-teaser-badge { right: 24px; } }
    @media (min-width: 768px) { .sf-teaser-badge { right: 52px; } }
  `]
})
export class StorefrontLandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private elRef = inject(ElementRef);
  experienceLoaded = true;
  currentYear = new Date().getFullYear();
  featuredBrands = signal<Brand[]>([]);
  private ctx!: gsap.Context;

  ngOnInit() {
    this.catalogService.getBrands().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          const featured = res.data.filter(b => b.showInCards);
          this.featuredBrands.set(featured);
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo('.blob-container',
          { opacity: 0, scale: 0.9 },
          { opacity: 0.65, scale: 1, duration: 1.6 },
          0.1
        );
      }, 50);
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {

      // ━━━ 1. Hero Load Entrance ━━━
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      heroTl.fromTo('app-welcome-section .bb-label',
        { y: -25, opacity: 0 }, { y: 0, opacity: 1, delay: 0.1 }
      );
      heroTl.fromTo('app-welcome-section .bb-h1',
        { y: 35, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.95'
      );
      heroTl.fromTo('app-welcome-section .bb-sub',
        { y: 25, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.95'
      );
      heroTl.fromTo('app-welcome-section .bb-btns',
        { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.85'
      );

      // ━━━ 2. "Shop by Category" Section Header ━━━
      gsap.fromTo('#sf-categories .sf-section-header',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#sf-categories',
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );

      // ━━━ 3. Category Cards — Staggered Pop-In ━━━
      gsap.fromTo('.sf-cat-card',
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.sf-cat-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // ━━━ 4. Collection Panels — Slide-up + Parallax ━━━
      gsap.fromTo('.sf-panel',
        { y: 80, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1.3, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#sf-collections',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Panel background parallax scrub
      gsap.utils.toArray<HTMLElement>('.sf-panel-bg').forEach((bg) => {
        gsap.fromTo(bg,
          { yPercent: -12 },
          {
            yPercent: 12, ease: 'none',
            scrollTrigger: {
              trigger: bg.closest('.sf-panel'),
              start: 'top bottom', end: 'bottom top',
              scrub: true
            }
          }
        );
      });

      // Panel badges — elastic pop
      gsap.fromTo('.sf-panel-badge',
        { scale: 0.3, opacity: 0, rotation: -12 },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 1.4, stagger: 0.15,
          ease: 'elastic.out(1, 0.75)',
          delay: 0.3,
          scrollTrigger: {
            trigger: '#sf-collections',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // ━━━ 5. "Why Families Love Us" Header ━━━
      gsap.fromTo('#sf-features .sf-section-header',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#sf-features',
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );

      // ━━━ 6. Feature Cards — Staggered Fade-up ━━━
      gsap.fromTo('.sf-feature-card',
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.sf-features-grid',
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );

      // ━━━ 7. Men's Teaser Banner — Slide + Scale ━━━
      gsap.fromTo('.sf-teaser',
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#sf-teaser',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Teaser background parallax scrub
      gsap.fromTo('.sf-teaser-bg',
        { yPercent: -12 },
        {
          yPercent: 12, ease: 'none',
          scrollTrigger: {
            trigger: '.sf-teaser',
            start: 'top bottom', end: 'bottom top',
            scrub: true
          }
        }
      );

      // Teaser badge — elastic pop
      gsap.fromTo('.sf-teaser-badge',
        { scale: 0.3, opacity: 0, rotation: -12 },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 1.4, ease: 'elastic.out(1, 0.75)',
          delay: 0.25,
          scrollTrigger: {
            trigger: '#sf-teaser',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // ━━━ 8. Trust Items — Staggered Reveal ━━━
      gsap.fromTo('.bb-trust .bb-trust-item',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8, stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.bb-trust',
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );

    }, this.elRef.nativeElement);
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }

  onBrandClick(brandId: string) {
    this.router.navigate(['/products'], { queryParams: { brand: brandId } });
  }
}
