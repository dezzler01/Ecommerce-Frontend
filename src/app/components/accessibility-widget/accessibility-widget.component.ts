import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-accessibility-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-widget.component.html',
  styleUrls: ['./accessibility-widget.component.css']
})
export class AccessibilityWidgetComponent {
  panelOpen = false;

  // State variables for toggles
  largeText = false;
  highContrast = false;
  giantCursor = false;
  freezeMotion = false;
  dyslexiaFont = false;
  focusAid = false;

  @ViewChild('panelContainer') panelContainerRef?: ElementRef<HTMLDivElement>;

  togglePanel() {
    this.panelOpen = !this.panelOpen;
  }

  toggleLargeText() {
    this.largeText = !this.largeText;
    this.updateBodyClass('accessibility-large-text', this.largeText);
  }

  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    this.updateBodyClass('accessibility-high-contrast', this.highContrast);
  }

  toggleGiantCursor() {
    this.giantCursor = !this.giantCursor;
    this.updateBodyClass('accessibility-giant-cursor', this.giantCursor);
  }

  toggleFreezeMotion() {
    this.freezeMotion = !this.freezeMotion;
    this.updateBodyClass('accessibility-freeze-motion', this.freezeMotion);
    
    if (this.freezeMotion) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  }

  toggleDyslexiaFont() {
    this.dyslexiaFont = !this.dyslexiaFont;
    this.updateBodyClass('accessibility-dyslexia-font', this.dyslexiaFont);
  }

  toggleFocusAid() {
    this.focusAid = !this.focusAid;
    this.updateBodyClass('accessibility-focus-aid', this.focusAid);
  }

  resetAll() {
    this.largeText = false;
    this.highContrast = false;
    this.giantCursor = false;
    this.freezeMotion = false;
    this.dyslexiaFont = false;
    this.focusAid = false;

    this.updateBodyClass('accessibility-large-text', false);
    this.updateBodyClass('accessibility-high-contrast', false);
    this.updateBodyClass('accessibility-giant-cursor', false);
    this.updateBodyClass('accessibility-freeze-motion', false);
    this.updateBodyClass('accessibility-dyslexia-font', false);
    this.updateBodyClass('accessibility-focus-aid', false);

    gsap.globalTimeline.resume();
  }

  private updateBodyClass(className: string, add: boolean) {
    if (typeof document !== 'undefined') {
      if (add) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.panelOpen) {
      this.panelOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.panelOpen && this.panelContainerRef) {
      const clickedInside = this.panelContainerRef.nativeElement.contains(event.target as Node);
      const clickedBtn = (event.target as HTMLElement).closest('.accessibility-widget-btn');
      if (!clickedInside && !clickedBtn) {
        this.panelOpen = false;
      }
    }
  }
}
