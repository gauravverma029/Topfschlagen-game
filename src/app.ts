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
  spoonDivElement: HTMLDivElement;
  floorhitAudioElement: HTMLAudioElement;
  winnerAudioElement: HTMLAudioElement;
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
    this.spoonDivElement = this.element.querySelector(
      '.spoon'
    ) as HTMLDivElement;

    this.floorhitAudioElement = this.element.querySelector(
      '#floorhitAudio'
    ) as HTMLAudioElement;

    this.winnerAudioElement = this.element.querySelector(
      '#winnerAudio'
    ) as HTMLAudioElement;

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
    this.winnerAudioElement.play();
    this.totalClickDivElement.innerHTML = `<p>Total Attempts - ${this.totalClick} </p>`;
    this.potDivElement.style.backgroundImage = "url('./src/static/pot.png')";
    this.winDivElement.style.display = 'block';
    this.spoonDivElement.style.display = 'none';
    this.element.style.cursor = 'pointer';
    this.potHitted = true;
  }

  private hitFloor(event: MouseEvent) {
    event.preventDefault();
    let actualHitFloorX = event.clientX;
    let actualHitFloorY = event.clientY;
    this.floorhitAudioElement.play();
    const powerOfX = Math.pow(this.potClientX - actualHitFloorX, 2);
    const PowerofY = Math.pow(this.potClientY - actualHitFloorY, 2);
    const sqrtValueOfhitFloorClient = Math.sqrt(powerOfX + PowerofY);
    this.totalClick++;
    if (this.prvClickValue !== 0) {
      if (!this.potHitted && sqrtValueOfhitFloorClient < this.prvClickValue) {
        this.hotDivElement.style.display = 'block';
        setTimeout(() => {
          this.hotDivElement.style.display = 'none';

          this.floorhitAudioElement.pause();
          this.floorhitAudioElement.currentTime = 0;
        }, 500);
      } else if (
        !this.potHitted &&
        sqrtValueOfhitFloorClient > this.prvClickValue
      ) {
        this.coldDivElement.style.display = 'block';
        setTimeout(() => {
          this.coldDivElement.style.display = 'none';
          this.floorhitAudioElement.pause();
          this.floorhitAudioElement.currentTime = 0;
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
    this.potDivElement.style.top = this.getRandomInt(90) + '%';
    this.potDivElement.style.left = this.getRandomInt(90) + '%';
    const clientRect = this.potDivElement.getBoundingClientRect();
    const clientX = clientRect.left;
    const clientY = clientRect.top;
    this.potClientX = clientX;
    this.potClientY = clientY;
  }

  private captureMovement(event: MouseEvent) {
    let clientX = event.clientX;
    let clientY = event.clientY;
    this.spoonDivElement.style.top = clientY + 1 + 'px';
    this.spoonDivElement.style.left = clientX + 'px';
  }

  private configure() {
    this.potDivElement.addEventListener('click', this.hitPot.bind(this));
    this.element.addEventListener('click', this.hitFloor.bind(this));
    this.element.addEventListener('mousemove', this.captureMovement.bind(this));
  }
}

const topfschlagenGame = new Topfschlagen();
