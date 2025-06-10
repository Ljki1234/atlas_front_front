import {Component, AfterViewInit, ViewChild, ElementRef, OnInit} from '@angular/core';
import {Router, RouterOutlet, NavigationEnd} from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
// import { RecaptchaModule } from 'ng-recaptcha';
import { Title, Meta } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// declare var Swiper: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    // RecaptchaModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'atlass-front';

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngAfterViewInit(): void {
    // new Swiper('.product-swiper', {
    //   slidesPerView: 1,
    //   spaceBetween: 30,
    //   loop: true,
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   },
    //   breakpoints: {
    //     768: {
    //       slidesPerView: 2,
    //     },
    //     1024: {
    //       slidesPerView: 3,
    //     }
    //   }
    // });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMetaTags();
    });
  }

  private updateMetaTags() {
    const currentRoute = this.router.url;

    // Default meta tags
    let title = 'Atlas Hotel - Luxury Accommodation';
    let description = 'Experience luxury and comfort at Atlas Hotel. Book your stay for an unforgettable experience.';
    let keywords = 'hotel, luxury, accommodation, Atlas Hotel, booking, stay';
    let image = 'assets/images/atlas-hotel.jpg';

    // Update meta tags based on route
    switch (currentRoute) {
      case '/':
        title = 'Atlas Hotel - Home';
        description = 'Welcome to Atlas Hotel - Your premier destination for luxury accommodation and exceptional service.';
        break;
      case '/reservation':
        title = 'Book Your Stay - Atlas Hotel';
        description = 'Reserve your luxury suite at Atlas Hotel. Choose from our premium accommodations and exclusive amenities.';
        break;
      // Add more routes as needed
    }

    // Update title
    this.titleService.setTitle(title);

    // Update meta tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });

    // Open Graph tags for social media
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: window.location.href });

    // Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }
}
