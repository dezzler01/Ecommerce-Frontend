import { Component, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { AccessibilityWidgetComponent } from './components/accessibility-widget/accessibility-widget.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    LoginComponent,
    AccessibilityWidgetComponent,
    NotificationToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  authService = inject(AuthService);
  public alertService = inject(AlertService);
  private platformId = inject(PLATFORM_ID);

  // Trailing cursor element references
  @ViewChild('cursorDot') cursorDotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorHalo') cursorHaloRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorTrail1') cursorTrail1Ref!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorTrail2') cursorTrail2Ref!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorTrail3') cursorTrail3Ref!: ElementRef<HTMLDivElement>;

  // Cursor physics tracking
  private mouseX = 0;
  private mouseY = 0;
  private haloX = 0;
  private haloY = 0;
  private mouseMoved = false;
  private animationFrameId?: number;

  // Trail physics tracking
  private trail1X = 0;
  private trail1Y = 0;
  private trail2X = 0;
  private trail2Y = 0;
  private trail3X = 0;
  private trail3Y = 0;

  private onMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    if (!this.mouseMoved) {
      this.mouseMoved = true;
      this.haloX = this.mouseX;
      this.haloY = this.mouseY;
      
      this.trail1X = this.mouseX + 16;
      this.trail1Y = this.mouseY + 16;
      this.trail2X = this.mouseX + 16;
      this.trail2Y = this.mouseY + 16;
      this.trail3X = this.mouseX + 16;
      this.trail3Y = this.mouseY + 16;
      
      if (this.cursorDotRef) {
        this.cursorDotRef.nativeElement.style.display = 'block';
      }
      if (this.cursorTrail1Ref) this.cursorTrail1Ref.nativeElement.style.display = 'block';
      if (this.cursorTrail2Ref) this.cursorTrail2Ref.nativeElement.style.display = 'block';
      if (this.cursorTrail3Ref) this.cursorTrail3Ref.nativeElement.style.display = 'block';
    }
  };

  private onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && (
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.tagName === 'P' || 
      target.tagName === 'SPAN' || 
      target.tagName === 'LI' || 
      target.tagName.startsWith('H') || 
      target.closest('a') || 
      target.closest('button') || 
      target.closest('[role="button"]')
    )) {
      this.cursorDotRef?.nativeElement?.classList.add('hovered');
      this.cursorHaloRef?.nativeElement?.classList.add('hovered');
    }
  };

  private onMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && (
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.tagName === 'P' || 
      target.tagName === 'SPAN' || 
      target.tagName === 'LI' || 
      target.tagName.startsWith('H') || 
      target.closest('a') || 
      target.closest('button') || 
      target.closest('[role="button"]')
    )) {
      this.cursorDotRef?.nativeElement?.classList.remove('hovered');
      this.cursorHaloRef?.nativeElement?.classList.remove('hovered');
    }
  };

  private onMouseDown = () => {
    this.cursorDotRef?.nativeElement?.classList.add('clicked');
    this.cursorHaloRef?.nativeElement?.classList.add('clicked');
  };

  private onMouseUp = () => {
    this.cursorDotRef?.nativeElement?.classList.remove('clicked');
    this.cursorHaloRef?.nativeElement?.classList.remove('clicked');
  };

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Hide cursor element wrappers initially
      if (this.cursorDotRef) {
        this.cursorDotRef.nativeElement.style.display = 'none';
      }
      if (this.cursorTrail1Ref) this.cursorTrail1Ref.nativeElement.style.display = 'none';
      if (this.cursorTrail2Ref) this.cursorTrail2Ref.nativeElement.style.display = 'none';
      if (this.cursorTrail3Ref) this.cursorTrail3Ref.nativeElement.style.display = 'none';

      // Attach event listeners
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseover', this.onMouseOver);
      document.addEventListener('mouseout', this.onMouseOut);
      document.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mouseup', this.onMouseUp);

      // Start custom cursor render loop
      this.updateCursor();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseover', this.onMouseOver);
      document.removeEventListener('mouseout', this.onMouseOut);
      document.removeEventListener('mousedown', this.onMouseDown);
      document.removeEventListener('mouseup', this.onMouseUp);
      
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
  }

  private updateCursor = () => {
    if (this.cursorDotRef && this.mouseMoved) {
      const dot = this.cursorDotRef.nativeElement;

      // Update solid dot position instantly
      dot.style.left = `${this.mouseX}px`;
      dot.style.top = `${this.mouseY}px`;

      // Interpolated movement for trailing drops
      const isHovered = dot.classList.contains('hovered');
      const offsetX = isHovered ? 12 : 14;
      const offsetY = isHovered ? 19 : 21;
      
      const targetX = this.mouseX + offsetX;
      const targetY = this.mouseY + offsetY;

      this.trail1X += (targetX - this.trail1X) * 0.18;
      this.trail1Y += (targetY - this.trail1Y) * 0.18;
      
      this.trail2X += (targetX - this.trail2X) * 0.12;
      this.trail2Y += (targetY - this.trail2Y) * 0.12;
      
      this.trail3X += (targetX - this.trail3X) * 0.08;
      this.trail3Y += (targetY - this.trail3Y) * 0.08;

      if (this.cursorTrail1Ref) {
        this.cursorTrail1Ref.nativeElement.style.left = `${this.trail1X}px`;
        this.cursorTrail1Ref.nativeElement.style.top = `${this.trail1Y}px`;
      }
      if (this.cursorTrail2Ref) {
        this.cursorTrail2Ref.nativeElement.style.left = `${this.trail2X}px`;
        this.cursorTrail2Ref.nativeElement.style.top = `${this.trail2Y}px`;
      }
      if (this.cursorTrail3Ref) {
        this.cursorTrail3Ref.nativeElement.style.left = `${this.trail3X}px`;
        this.cursorTrail3Ref.nativeElement.style.top = `${this.trail3Y}px`;
      }
    }

    this.animationFrameId = requestAnimationFrame(this.updateCursor);
  };
}
