module.exports = store;

function store(state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    let rejectFunction = null;
    let acceptFunction = null;

    let cards = document.querySelectorAll('.card');
    let target = null;
    let targetBCR = null;
    let startX = 0;
    let currentX = 0;
    let screenX = 0;
    let targetX = 0;
    let draggingCard = false;
    let friction = null;

    emitter.on('cards:reset', (reject, accept) => {
      rejectFunction = reject;
      acceptFunction = accept;

      target = null;

      cards = document.querySelectorAll('.card');
      if (!state.hooked) {
        document.addEventListener('touchstart', onStart);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onEnd);

        document.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        state.hooked = true;
      }
    });

    function findCard(target) {
      while (!target.classList.contains('card')) {
        if (target === undefined) {
          return false;
        }
        target = target.parentNode;
      }
      return target;
    }

    function onStart(e) {
      if (target) { return; }

      target = findCard(e.target);
      if (!target) {
        return;
      }
      targetBCR = target.getBoundingClientRect();

      startX = e.pageX || e.touches[0].pageX;
      currentX = startX;

      draggingCard = true;

      target.style.willChange = 'transform';

      e.preventDefault();
      requestAnimationFrame(update); // TODO: AAAAAAAAAAA
    }
    function onMove(e) {
      if (!target) return;
      const newX = e.pageX || e.touches[0].pageX;
      friction = (currentX - newX);
      currentX = newX;
    }
    function onEnd(e) {
      if (!target) return;

      targetX = 0;
      if (Math.abs(screenX) > targetBCR.width * 0.35) {
        targetX = (screenX > 0) ? targetBCR.width : -targetBCR.width;
      }
      draggingCard = false;
    }
    function update(e) {
      requestAnimationFrame(update);
      if (!target) return;
      if (draggingCard) {
        screenX = currentX - startX;
      } else {
        const stepCount = (1 - Math.abs(friction / 100)) * 40;// TODO OOOOO
        console.log(stepCount);
        screenX += (targetX - screenX) / stepCount;
      }

      const swipeDirection = screenX / targetBCR.width < 0 ? 'left' : 'right';

      const normalizedDragDistance = (Math.abs(screenX) / targetBCR.width);
      const opacity = 1 - Math.pow(normalizedDragDistance, 2);
      const rotation = -(screenX / targetBCR.width) * 2.5;
      target.style.transform = `translateX(${screenX}px) rotate(${rotation}deg)`;
      target.style.opacity = opacity;

      const isNearlyAtStart = (Math.abs(screenX) < 0.001);
      const isNearlyGone = (opacity < 0.01);

      if (!draggingCard) {
        if (isNearlyGone) {
          if (!target || !target.parentNode) { return; }
          let isAfterCurrentTarget = false;

          const onTransitionEnd = (evt) => {
            target = null;
            evt.target.style.transition = 'none';
            evt.target.removeEventListener('transitionend', onTransitionEnd);
            // all done, now we can render next card
            emitter.emit(state.events.RENDER);
          };

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card === target) {
              isAfterCurrentTarget = true;
              continue;
            }
            if (!isAfterCurrentTarget) {
              continue;
            }

            // we know this is the next card:
            card.style.transform = `translateY(${targetBCR.height}px)`;
            requestAnimationFrame(() => {
              card.style.transition = 'transform .4s cubic-bezier(0,0,0.31,1)';
              card.style.transform = 'none';
            });
            card.addEventListener('transitionend', onTransitionEnd);
          }

          if (swipeDirection === 'right') {
            acceptFunction(target.id);
          }
          if (swipeDirection === 'left') {
            rejectFunction();
          }
          target.parentNode.removeChild(target);
        }
        if (isNearlyAtStart) {
          target.style.willChange = 'initial';
          target.style.transform = 'none';
          target = null;
        }
      }
    }
  });
}
