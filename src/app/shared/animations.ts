import { trigger, transition, style, animate, query, stagger, AUTO_STYLE, state } from '@angular/animations';

export const fade = trigger('fade', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.01)' }), animate('500ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))]
    ),
    transition(':leave',
      [style({ opacity: 1, transform: 'scale(1)' }), animate('500ms ease-out', style({ opacity: 0, transform: 'scale(0.01)' }))]
    )
]);
