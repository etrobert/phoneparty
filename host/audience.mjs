import {players} from './players.mjs';

import PlayerBubble from './player-bubble.mjs';

document.head.insertAdjacentHTML('beforeend', `
  <link rel="stylesheet" href="/host/audience.css">
`);

export default class Audience extends HTMLElement {
  constructor(routeContext) {
    super();

    const {listenForPlayers, listenForLeavingPlayers} = routeContext;

    this.playerSlotMap = new Map();

    listenForPlayers(player => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      setTimeout(() => slot.classList.add('open'), 100);

      const playerBubble = new PlayerBubble(player);
      slot.append(playerBubble);
      slot.playerBubble = playerBubble;

      this.append(slot);
      this.playerSlotMap.set(player, slot);
      this.style.setProperty('--player-count', players.length);
    });

    listenForLeavingPlayers(player => {
      const slot = this.playerSlotMap.get(player);
      if (slot) {
        slot.classList.remove('open');
        setTimeout(() => slot.remove(), 500);
        this.playerSlotMap.delete(player);
      }
      this.style.setProperty('--player-count', players.length);
    });
  }

  getPlayerBubble(player) {
    const slot = this.playerSlotMap.get(player);
    return slot && slot.playerBubble;
  }
}

customElements.define('audience-el', Audience);