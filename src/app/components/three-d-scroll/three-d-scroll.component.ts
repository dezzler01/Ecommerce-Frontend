import { 
  Component, 
  ElementRef, 
  OnInit, 
  AfterViewInit, 
  OnDestroy, 
  ViewChild, 
  Inject, 
  PLATFORM_ID 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-three-d-scroll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #threeCanvas class="three-d-canvas"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1; /* Render behind text and navbar but above the static background */
      pointer-events: none; /* Let clicks pass through to text/buttons */
    }
    .three-d-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }
  `]
})
export class ThreeDScrollComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private mesh?: THREE.Mesh;
  private animationFrameId?: number;
  private resizeListener?: () => void;
  private scrollTriggers: ScrollTrigger[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Small timeout to guarantee DOM is fully painted
      setTimeout(() => {
        this.initThree();
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }
      this.scrollTriggers.forEach(trigger => trigger.kill());
      
      // Dispose Three.js resources to prevent memory leaks
      if (this.mesh) {
        this.mesh.geometry.dispose();
        if (Array.isArray(this.mesh.material)) {
          this.mesh.material.forEach((m: THREE.Material) => {
            const pm = m as THREE.MeshPhysicalMaterial;
            if (pm.bumpMap) pm.bumpMap.dispose();
            pm.dispose();
          });
        } else {
          const pm = this.mesh.material as THREE.MeshPhysicalMaterial;
          if (pm.bumpMap) pm.bumpMap.dispose();
          this.mesh.material.dispose();
        }
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 8;

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true, // Transparent background so our plaster wall shows behind it
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Geometry (Generate a beautiful luxury box block)
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    // 5. Materials (engraved champagne-gold textures for 6 faces)
    const materials = this.createCubeMaterials();

    // 6. Mesh
    this.mesh = new THREE.Mesh(geometry, materials);
    
    // Initial position matching Hero section (placed on the center-right)
    this.mesh.position.set(1.6, 0.2, 0);
    this.mesh.rotation.set(0.3, 0.6, 0); // Angled to show multiple faces
    this.scene.add(this.mesh);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5e6, 2.5); // Warm gold key light
    dirLight1.position.set(5, 5, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2); // Cool fill light
    dirLight2.position.set(-5, -3, 2);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(0, 0, 4);
    this.scene.add(pointLight);

    // 8. Animation Loop
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      if (this.mesh) {
        // Slow constant ambient rotation
        this.mesh.rotation.y += 0.005;
        this.mesh.rotation.x += 0.002;
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    animate();

    // 9. Resize handler
    this.resizeListener = () => {
      if (this.camera && this.renderer) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', this.resizeListener);

    // 10. GSAP ScrollTrigger Animations
    this.setupScrollAnimations();
  }

  private setupScrollAnimations(): void {
    if (!this.mesh) return;

    const mm = gsap.matchMedia();

    // Desktop
    mm.add("(min-width: 1024px)", () => {
      if (this.mesh) {
        this.mesh.position.set(1.6, 0.2, 0);
        this.mesh.scale.set(1.0, 1.0, 1.0);
      }

      const t1 = gsap.to(this.mesh!.position, {
        x: -1.8,
        y: -1.8,
        z: 0.5,
        scrollTrigger: {
          trigger: '#little-one',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const r1 = gsap.to(this.mesh!.rotation, {
        x: 1.5,
        y: 2.2,
        z: 0.8,
        scrollTrigger: {
          trigger: '#little-one',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const t2 = gsap.to(this.mesh!.position, {
        x: 1.8,
        y: -4.5,
        z: -0.5,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const r2 = gsap.to(this.mesh!.rotation, {
        x: 3.0,
        y: -1.0,
        z: 1.5,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const s2 = gsap.to(this.mesh!.scale, {
        x: 1.25,
        y: 1.25,
        z: 1.25,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      if (t1.scrollTrigger) this.scrollTriggers.push(t1.scrollTrigger);
      if (r1.scrollTrigger) this.scrollTriggers.push(r1.scrollTrigger);
      if (t2.scrollTrigger) this.scrollTriggers.push(t2.scrollTrigger);
      if (r2.scrollTrigger) this.scrollTriggers.push(r2.scrollTrigger);
      if (s2.scrollTrigger) this.scrollTriggers.push(s2.scrollTrigger);
    });

    // Tablet
    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      if (this.mesh) {
        this.mesh.position.set(1.0, 0.4, 0);
        this.mesh.scale.set(0.8, 0.8, 0.8);
      }

      const t1 = gsap.to(this.mesh!.position, {
        x: -1.0,
        y: -1.6,
        z: 0.2,
        scrollTrigger: {
          trigger: '#little-one',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const r1 = gsap.to(this.mesh!.rotation, {
        x: 1.5,
        y: 2.2,
        z: 0.8,
        scrollTrigger: {
          trigger: '#little-one',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const t2 = gsap.to(this.mesh!.position, {
        x: 1.0,
        y: -4.0,
        z: -0.2,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const r2 = gsap.to(this.mesh!.rotation, {
        x: 3.0,
        y: -1.0,
        z: 1.5,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      if (t1.scrollTrigger) this.scrollTriggers.push(t1.scrollTrigger);
      if (r1.scrollTrigger) this.scrollTriggers.push(r1.scrollTrigger);
      if (t2.scrollTrigger) this.scrollTriggers.push(t2.scrollTrigger);
      if (r2.scrollTrigger) this.scrollTriggers.push(r2.scrollTrigger);
    });

    // Mobile
    mm.add("(max-width: 767px)", () => {
      if (this.mesh) {
        this.mesh.position.set(0, 1.2, -0.5);
        this.mesh.scale.set(0.6, 0.6, 0.6);
      }

      const t1 = gsap.to(this.mesh!.position, {
        x: 0,
        y: -1.2,
        z: -0.5,
        scrollTrigger: {
          trigger: '#little-one',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const r1 = gsap.to(this.mesh!.rotation, {
        x: 2.0,
        y: 1.8,
        z: 1.2,
        scrollTrigger: {
          trigger: '#little-one',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const t2 = gsap.to(this.mesh!.position, {
        x: 0,
        y: -3.5,
        z: -0.5,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      const r2 = gsap.to(this.mesh!.rotation, {
        x: 3.5,
        y: -0.5,
        z: 2.0,
        scrollTrigger: {
          trigger: '#clothing',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5
        }
      });

      if (t1.scrollTrigger) this.scrollTriggers.push(t1.scrollTrigger);
      if (r1.scrollTrigger) this.scrollTriggers.push(r1.scrollTrigger);
      if (t2.scrollTrigger) this.scrollTriggers.push(t2.scrollTrigger);
      if (r2.scrollTrigger) this.scrollTriggers.push(r2.scrollTrigger);
    });
  }

  private createFaceTexture(letter: string): THREE.Texture {
    const size = 512; // 512x512 for high-resolution crisp borders/text
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Fill background with white (bumpMap: white is flat/high)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw an elegant luxury border (bumpMap: black is recessed)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, size - 80, size - 80);
    
    ctx.lineWidth = 4;
    ctx.strokeRect(62, 62, size - 124, size - 124);

    // Draw the letter or symbol in the center (black)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 230px "Playfair Display", "Georgia", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Adjust y-offset for heart symbol vs letters
    const yOffset = letter === '♡' ? -15 : 12;
    ctx.fillText(letter, size / 2, size / 2 + yOffset);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createCubeMaterials(): THREE.MeshPhysicalMaterial[] {
    // 6 faces of the cube (Right, Left, Top, Bottom, Front, Back)
    const faceLetters = ['K', 'B', '♡', 'E', 'P', 'M'];
    
    return faceLetters.map(letter => {
      const bumpTex = this.createFaceTexture(letter);
      return new THREE.MeshPhysicalMaterial({
        color: 0xE6D5C3, // Luxury warm champagne-gold base color
        metalness: 0.9,
        roughness: 0.18,
        bumpMap: bumpTex,
        bumpScale: -0.06, // Negative bump creates elegant engraved/debossed depth
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0
      });
    });
  }
}
