import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media.service';
import { resolveImageUrl } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2" [ngClass]="{'gap-4': !compact}">
      <!-- Image Preview Thumbnail -->
      <div 
        [ngClass]="compact ? 'w-8 h-8 rounded' : 'w-16 h-16 rounded-xl'"
        class="relative border border-[var(--text-charcoal)]/10 bg-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300"
      >
        <img *ngIf="imageUrl" [src]="resolveImageUrl(imageUrl)" class="w-full h-full object-cover" />
        <div *ngIf="!imageUrl" class="w-full h-full flex flex-col items-center justify-center text-[7px] text-[#8A817C] uppercase font-bold tracking-widest bg-gray-50 border-2 border-dashed border-[var(--text-charcoal)]/10 select-none">
          No Img
        </div>
        <!-- Loader Spinner Overlay -->
        <div *ngIf="loading()" class="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
          <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-coral)]" [ngClass]="{'h-3 w-3': compact}"></span>
        </div>
      </div>

      <!-- File Select Button -->
      <label 
        [ngClass]="compact ? 'px-2 py-1 text-[8px] rounded-lg' : 'px-4 py-2.5 text-[10px] rounded-xl'"
        class="border border-[var(--text-charcoal)]/15 hover:bg-[var(--text-charcoal)]/5 text-[var(--text-charcoal)] font-bold uppercase tracking-widest transition-all cursor-pointer select-none relative overflow-hidden flex-shrink-0"
      >
        {{ loading() ? 'Uploading...' : label }}
        <input type="file" accept="image/*" class="hidden" [disabled]="loading()" (change)="onFileSelected($event)" />
      </label>
      
      <!-- Error Message -->
      <span *ngIf="errorMessage()" class="text-[9px] text-red-500 font-semibold max-w-[200px] leading-tight block">
        {{ errorMessage() }}
      </span>
    </div>
  `
})
export class AppImageUploaderComponent {
  private mediaService = inject(MediaService);
  resolveImageUrl = resolveImageUrl;

  @Input() imageUrl: string | null | undefined = null;
  @Input() label: string = 'Choose File';
  @Input() compact: boolean = false;
  @Output() uploaded = new EventEmitter<string>();

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.loading.set(true);
      this.errorMessage.set('');
      
      this.mediaService.upload(file).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.isSuccess && res.url) {
            this.imageUrl = res.url;
            this.uploaded.emit(res.url);
          } else {
            this.errorMessage.set('Upload failed.');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message || 'Server error uploading file.');
        }
      });
    }
  }
}
