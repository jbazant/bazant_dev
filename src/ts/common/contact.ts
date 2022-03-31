import { appendPara, gid } from '../utils/domHelpers';

abstract class FormField {
  id: string;
  elem: HTMLTextAreaElement | HTMLInputElement;
  errors: Array<string> = [];

  get isValid() {
    return this.errors.length === 0;
  }

  get value() {
    return this.elem.value;
  }

  constructor(id: string) {
    this.id = id;
    // @ts-ignore - lets pretend we know what we get
    this.elem = gid(id);
    if (!this.elem) {
      throw new Error('Element not found!');
    }
  }

  clearErrors = () => {
    this.errors = [];
    while (this.elem.nextSibling) {
      this.elem.parentNode.removeChild(this.elem.nextSibling);
    }
    this.elem.classList.remove('form-field-error');
  };

  addError = (errorText: string) => {
    appendPara(this.elem, errorText, 'form-error');
    this.elem.classList.add('form-field-error');
  };

  onChange = () => {
    this.clearErrors();
  };

  onBlur = () => {
    this.clearErrors();
    this.validate();
    this.errors.forEach(this.addError);
  };

  abstract validate(): void;
}

class EmailField extends FormField {
  validate() {
    if (this.value == '') {
      this.errors.push('Prosím zadejte email.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      this.errors.push('Neplatný formát emailu.');
    }
  }
}

class MessageField extends FormField {
  validate() {
    if (this.value.length < 10) {
      this.errors.push('Prosím vyplňte alespoň krátkou zprávu.');
    }
  }
}

class ContactForm {
  elem: HTMLFormElement;
  fields: Array<FormField>;
  submitButton: HTMLButtonElement;
  action: string | null;

  constructor(
    id: string,
    fields: Array<FormField>,
    submitFormButtonId: string,
    action: string | null = null
  ) {
    this.fields = fields;
    // @ts-ignore
    this.elem = gid(id);
    // @ts-ignore
    this.submitButton = gid(submitFormButtonId);

    this.action = action;

    this.fields.forEach((it) => {
      it.elem.addEventListener('input', it.onChange);
      it.elem.addEventListener('blur', it.onBlur);
    });

    this.elem.addEventListener('submit', this.submit);
    // todo disable submit button
  }

  submit = async (event: Event) => {
    event.preventDefault();

    this.fields.forEach((it) => it.onBlur());
    if (this.fields.reduce((acc, it) => acc && it.isValid, true)) {
      const { action, method } = this.elem;
      this.submitButton.disabled = true;

      try {
        const response = await fetch(this.action ?? action, {
          method,
          headers: {
            Accept: 'application/json',
          },
          body: new FormData(this.elem),
        });

        if (response.ok) {
          const parent = this.elem.parentNode;
          parent.removeChild(this.elem);
          const para = document.createElement('p');
          para.innerHTML = 'Paráda, holub je na cestě!';
          para.classList.add('form-success-info');
          parent.appendChild(para);
        } else {
          this.fields[this.fields.length - 1].addError(
            'Ajaj. Něco se pokazilo! Možná to zkusíme později?'
          );
        }
      } catch (e) {
        this.fields[this.fields.length - 1].addError(
          'Ajaj. Něco se pokazilo! Možná to zkusíme později?'
        );
      } finally {
        this.submitButton.disabled = false;
      }
    }
  };
}

export const initContactForm = (): void => {
  const formId = 'contact-form';
  const submitFormButtonId = 'contact-form-submit';

  if (gid(formId)) {
    new ContactForm(
      formId,
      [new EmailField('contact-form-email'), new MessageField('contact-form-message')],
      submitFormButtonId,
      'https://formspree.io/f/mdopvdrj'
    );

    // todo disposer?
  }
};
