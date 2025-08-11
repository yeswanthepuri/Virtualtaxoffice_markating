import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Add delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initAboutAnimations();
    }, 100);
  }

  private initAboutAnimations() {
    // Hero animations
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)' }
    );

    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
    );

    // Intro text animations
    gsap.fromTo('.intro-text', 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.intro-content',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Advantage title animation
    gsap.fromTo('.advantage-title', 
      { opacity: 0, scale: 0.8, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.advantage-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Advantage cards animation
    gsap.fromTo('.advantage-card', 
      { opacity: 0, y: 50, rotationX: 45 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.advantage-card',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Advantage icons animation
    gsap.fromTo('.advantage-icon', 
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.advantage-card',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Modules title animation
    gsap.fromTo('.modules-title', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.modules-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Module cards animation
    gsap.fromTo('.module-card', 
      { opacity: 0, x: -50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.module-card',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Module icons animation
    gsap.fromTo('.module-icon img', 
      { scale: 0, rotation: 90 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.module-card',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // CTA buttons animation
    gsap.fromTo('.cta-btn', 
      { opacity: 0, scale: 0.8, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.cta-btn',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Hover animations for cards
    const cards = this.elementRef.nativeElement.querySelectorAll('.advantage-card, .module-card');
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -5, scale: 1.02, duration: 0.3, ease: 'power2.out' });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }
}