import { appendPara, gid } from '../utils/domHelpers';

// todo use class and real state bitch!
function clearError(el: HTMLElement) {
  if (el.nextSibling) {
    el.parentNode.removeChild(el.nextSibling);
  }
}

function addError(el: HTMLElement, text: string) {
  appendPara(el, text, 'form-error');
  // todo disable submit
}

// todo is it corretly placed?
function onFormResponse(data: Object) {}

function onFormError(error: Object) {}

function onFormSubmit(event: Event) {
  event.preventDefault();
  // validate form one more time
  onEmailBlur();
  onMessageBlur();
  // todo check for any error

  // change button to some waiting sign

  fetch(this.action, {
    method: this.method,
    headers: {
      Accept: 'application/json',
    },
    body: new FormData(this),
  })
    .then((response) => response.json())
    .then(onFormResponse, onFormError);
  // todo success and fail
}

// todo test validatation function (and probably move it somewhere else
function validateEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

function onEmailBlur(): void {
  clearError(this);

  if (!validateEmail(this.value)) {
    addError(this, 'Neplatný formát emailu.');
  }
}

function onMessageBlur(): void {
  clearError(this);

  if (this.textLength < 10) {
    addError(this, 'Prosím vyplňte alespoň krátkou zprávu.');
  }
}

function onFieldChange(): void {
  clearError(this);
}

export function initContactForm(): void {
  const contactForm = gid('contact-form');

  if (contactForm) {
    const email = gid('contact-form-email');
    const message = gid('contact-form-message');

    if (email && message) {
      contactForm.addEventListener('submit', onFormSubmit);

      email.addEventListener('blur', onEmailBlur);
      email.addEventListener('change', onFieldChange);

      message.addEventListener('blur', onMessageBlur);
      message.addEventListener('change', onFieldChange);
    }
  }
}

// todo disposer?
