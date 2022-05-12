import { animate, state, style, transition, trigger } from '@angular/animations';

// Component transition animations
export const heightAnimation =
    trigger('heightAnimation', [
        state('close', style({
            height: 0
        })),
        state('open', style({
            height: '*'
        })),
        transition('open <=> close', animate('200ms ease-in')),
    ])
    ;