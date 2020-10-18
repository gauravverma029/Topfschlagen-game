class Topfschlagen {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLDivElement;
  potDivElement: HTMLDivElement;
  hotDivElement: HTMLDivElement;
  coldDivElement: HTMLDivElement;
  winDivElement: HTMLDivElement;
  winnerDivElement: HTMLDivElement;
  totalClickDivElement: HTMLDivElement;
  potClientX: number;
  potClientY: number;
  prvClickValue: number;
  potHitted: Boolean;
  totalClick: number;

  constructor() {
    this.templateElement = document.getElementById(
      'topfschlagen'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('add')! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.potDivElement = this.element.querySelector('.pot') as HTMLDivElement;
    this.hotDivElement = this.element.querySelector('.hot') as HTMLDivElement;
    this.coldDivElement = this.element.querySelector('.cold') as HTMLDivElement;
    this.winDivElement = this.element.querySelector('.win') as HTMLDivElement;

    this.winnerDivElement = this.element.querySelector(
      '.winner'
    ) as HTMLDivElement;
    this.totalClickDivElement = this.element.querySelector(
      '.totalClick'
    ) as HTMLDivElement;

    this.potClientX = 0;
    this.potClientY = 0;
    this.prvClickValue = 0;
    this.totalClick = 0;
    this.potHitted = false;
    this.configure();
    this.attach();
    this.setPotOnDynamicPosition();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }

  private hitPot(event: MouseEvent) {
    event.preventDefault();
    this.totalClickDivElement.innerHTML = `<p>Total Click : ${this.totalClick} </p>`;
    this.winDivElement.style.display = 'block';
    this.potDivElement.style.backgroundColor = 'red';
    this.potHitted = true;
  }

  private hitFloor(event: MouseEvent) {
    event.preventDefault();
    let actualHitFloorX = event.clientX;
    let actualHitFloorY = event.clientY;
    const powerOfX = Math.pow(this.potClientX - actualHitFloorX, 2);
    const PowerofY = Math.pow(this.potClientY - actualHitFloorY, 2);
    const sqrtValueOfhitFloorClient = Math.sqrt(powerOfX + PowerofY);
    this.totalClick++;
    if (this.prvClickValue !== 0) {
      if (!this.potHitted && sqrtValueOfhitFloorClient < this.prvClickValue) {
        this.hotDivElement.style.display = 'block';
        setTimeout(() => {
          this.hotDivElement.style.display = 'none';
        }, 500);
      } else if (
        !this.potHitted &&
        sqrtValueOfhitFloorClient > this.prvClickValue
      ) {
        this.coldDivElement.style.display = 'block';
        setTimeout(() => {
          this.coldDivElement.style.display = 'none';
        }, 500);
      }
    }
    this.prvClickValue = sqrtValueOfhitFloorClient;
    clearTimeout();
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private setPotOnDynamicPosition() {
    this.potDivElement.style.top = this.getRandomInt(80) + '%';
    this.potDivElement.style.left = this.getRandomInt(80) + '%';
    const clientRect = this.potDivElement.getBoundingClientRect();
    const clientX = clientRect.left;
    const clientY = clientRect.top;
    this.potClientX = clientX;
    this.potClientY = clientY;
  }

  private configure() {
    this.potDivElement.addEventListener('click', this.hitPot.bind(this));
    this.element.addEventListener('click', this.hitFloor.bind(this));
  }
}

const topfschlagenGame = new Topfschlagen();
