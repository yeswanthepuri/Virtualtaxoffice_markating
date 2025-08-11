import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, AfterViewInit {
  discountPercentages = {
    orgChart: 5,
    exCert: 10,
    workflow: 15
  };
  originalPrices = {
    orgChart: 1000,
    exCert: 3000,
    workflow: 3000
  };
  discountedPrices = {
    orgChart: 1000,
    exCert: 3000,
    workflow: 3000
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.loadDiscountConfig();
  }

  // Configurable method for future database integration
  private loadDiscountConfig() {
    // TODO: Replace with API call to get individual discounts from database
    this.discountPercentages = {
      orgChart: 5,   // 5% discount for OrgChart
      exCert: 10,    // 10% discount for ExCert
      workflow: 15   // 15% discount for Workflow
    };
    this.calculateDiscountedPrices();
  }

  private calculateDiscountedPrices() {
    this.discountedPrices.orgChart = Math.round(this.originalPrices.orgChart * (1 - this.discountPercentages.orgChart / 100));
    this.discountedPrices.exCert = Math.round(this.originalPrices.exCert * (1 - this.discountPercentages.exCert / 100));
    this.discountedPrices.workflow = Math.round(this.originalPrices.workflow * (1 - this.discountPercentages.workflow / 100));
  }

  ngAfterViewInit() {
    // Add delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initPricingAnimations();
    }, 100);
  }

  private initPricingAnimations() {
    // Hero animations
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)' }
    );

    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
    );

    // Pricing cards animation
    gsap.fromTo('.pricing-card', 
      { opacity: 0, y: 80, rotationX: 45 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pricing-card',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
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

    // Video section animation
    gsap.fromTo('.video-section', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.video-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Details section animations
    gsap.fromTo('.details-title', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.details-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.detail-item, .detail-card', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.details-content',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.guarantee-section', 
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.guarantee-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Hover animations for pricing cards
    const cards = this.elementRef.nativeElement.querySelectorAll('.pricing-card');
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
      });
    });
  }
}