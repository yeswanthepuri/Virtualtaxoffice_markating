import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isMobileMenuOpen = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Add delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initHeaderAnimations();
    }, 100);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const mobileMenu = this.elementRef.nativeElement.querySelector('.mobile-menu');
    const hamburgerIcon = this.elementRef.nativeElement.querySelector('.hamburger-icon');
    const closeIcon = this.elementRef.nativeElement.querySelector('.close-icon');
    
    if (this.isMobileMenuOpen) {
      mobileMenu.classList.remove('hidden');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      
      gsap.fromTo(mobileMenu, 
        { opacity: 0, height: 0 },
        { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
      );
      
      gsap.fromTo('.mobile-nav-link', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }
      );
    } else {
      gsap.to(mobileMenu, {
        opacity: 0,
        height: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          mobileMenu.classList.add('hidden');
          hamburgerIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      });
    }
  }

  private initHeaderAnimations() {
    gsap.fromTo('.logo-container', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
    );
    
    gsap.fromTo('.nav-menu', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 }
    );
    
    gsap.fromTo('.auth-buttons', 
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 }
    );

    const logoContainer = this.elementRef.nativeElement.querySelector('.logo-container');
    if (logoContainer) {
      logoContainer.addEventListener('mouseenter', () => {
        gsap.to('.logo-text h1', { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });
      
      logoContainer.addEventListener('mouseleave', () => {
        gsap.to('.logo-text h1', { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    }

    const navLinks = this.elementRef.nativeElement.querySelectorAll('.nav-link');
    navLinks.forEach((link: HTMLElement, index: number) => {
      gsap.fromTo(link, 
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.6 + (index * 0.1) }
      );
    });

    const authButtons = this.elementRef.nativeElement.querySelectorAll('.signup-btn, .login-btn');
    authButtons.forEach((button: HTMLElement) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    });
  }
}