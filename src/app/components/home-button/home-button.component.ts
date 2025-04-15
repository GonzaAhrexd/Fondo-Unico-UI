import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home-buttons',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div [routerLink]="ruta" class="cursor-pointer z-10 rounded-lg md:h-32 lg:h-24 xl:h-32 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-sky-900 hover:bg-sky-950 transform transition-transform duration-300 ease-in-out hover:scale-105">
      <div class="flex flex-row md:flex-col md:items-center lg:flex-row lg:items-start justify-between">
        <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-50">
          {{texto}}
        </h5>
        <div [innerHTML]="sanitizedHtml"></div>
      </div>
    </div>
  `,
})



export class HomeButtonsComponent implements OnChanges {
  @Input() texto: string = "";
  @Input() ruta: string = "";
  @Input() SVG: string = "";

  sanitizedHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['SVG']) {
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.SVG);
    }
  }
}