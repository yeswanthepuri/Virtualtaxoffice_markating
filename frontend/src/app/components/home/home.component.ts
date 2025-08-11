import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0%)' }))
      ])
    ]),
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms 300ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.9)' }),
        animate('800ms 600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0px) scale(1)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Add delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initHomeAnimations();
    }, 100);
  }

  private initHomeAnimations() {
    // Enhanced services section animations
    const servicesSection = this.elementRef.nativeElement.querySelector('.services-section');
    if (servicesSection) {
      // Title words animation
      gsap.fromTo('.title-word', 
        { 
          opacity: 0, 
          y: 100, 
          rotationX: 90,
          scale: 0.5
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Arrow separators animation
      gsap.fromTo('.title-separator', 
        { 
          opacity: 0, 
          scale: 0,
          rotation: -180
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.8,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          delay: 0.4
        }
      );

      // Service cards with staggered entrance
      gsap.fromTo('.service-card', 
        { 
          opacity: 0, 
          y: 100, 
          rotationX: 45,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Icon animations with bounce effect
      gsap.fromTo('.service-icon', 
        { 
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Text content fade-in with delay
      gsap.fromTo('.service-text', 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Animate solution cards on scroll
    gsap.fromTo('.solution-card', 
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.solution-card',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Animate icons with motion path
    gsap.fromTo('.icon-container img',
      { rotation: -10, scale: 0.8 },
      {
        rotation: 0,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.solution-card',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Hover animations for cards
    const cards = this.elementRef.nativeElement.querySelectorAll('.solution-card');
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out' });
        gsap.to(card.querySelector('.icon-container img'), {
          rotation: 5,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(card.querySelector('.icon-container img'), {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
}