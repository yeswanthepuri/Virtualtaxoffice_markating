import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Add delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initFooterAnimations();
    }, 100);
  }

  private initFooterAnimations() {
    gsap.fromTo('.footer-left', 
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    gsap.fromTo('.footer-right', 
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    const inputs = this.elementRef.nativeElement.querySelectorAll('.form-input');
    inputs.forEach((input: HTMLElement) => {
      input.addEventListener('focus', () => {
        gsap.to(input, { scale: 1.02, duration: 0.2, ease: 'power2.out' });
      });
      
      input.addEventListener('blur', () => {
        gsap.to(input, { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    });

    const footerLinks = this.elementRef.nativeElement.querySelectorAll('.footer-links a');
    footerLinks.forEach((link: HTMLElement) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, { y: -2, duration: 0.2, ease: 'power2.out' });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { y: 0, duration: 0.2, ease: 'power2.out' });
      });
    });
  }
}