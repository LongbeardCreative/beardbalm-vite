function initField(field: HTMLDivElement) {
  const label =
    field.querySelector('.gfield_label') || field.querySelector('label');

  if (!label) {
    return;
  }

  const input = field.querySelector(`#${label.getAttribute('for')}`) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | undefined;

  const handleFocus = () => {
    label.classList.add('focus');
  };

  const handleBlur = () => {
    const updateState = () => {
      label.classList.remove('focus');
      if (input?.value) {
        label.classList.add('filled');
      } else {
        label.classList.remove('filled');
      }
    };

    if (input?.classList.contains('hasDatepicker')) {
      // Set Timeout to accommodate for tools such as datepicker
      setTimeout(updateState, 250);
    } else {
      updateState();
    }
  };

  handleBlur();

  if (input) {
    input.removeEventListener('focus', handleFocus);
    input.removeEventListener('blur', handleBlur);
    input.removeEventListener('change', handleBlur);

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('change', handleBlur);
  }

  // Check for select
  // if (input.tagName === 'SELECT') {
  //   if (input.querySelector('.gf_placeholder')) {
  //     input.querySelector('.gf_placeholder').innerText = '';
  //   }
  // }
}

export default function formInput() {
  const fields = document.querySelectorAll(
    '.gfield.hidden_label, .ginput_container_address > span, .ginput_container_name > span'
  );
  fields.forEach((field) => initField(field as HTMLDivElement));
}
