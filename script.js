const TIP_UPPER_BOUND = 100;
const BILL_UPPER_BOUND = 1000000000;
const DEFAULTS = {
  bill: '',
  tip: '15',
  people: '2'
};

const form = document.querySelector('#tip-form');
const billInput = document.querySelector('#bill');
const tipInput = document.querySelector('#tip');
const peopleInput = document.querySelector('#people');
const tipButtons = [...document.querySelectorAll('.tip-button')];

const output = {
  tipTotal: document.querySelector('#tip-total'),
  grandTotal: document.querySelector('#grand-total'),
  perPerson: document.querySelector('#per-person')
};

const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const parseAmount = (value) => {
  const trimmed = value.trim();
  if (trimmed === '') return { value: null, empty: true };
  if (!/^(\d+(\.\d*)?|\.\d+)$/.test(trimmed)) return { value: null, invalid: true };
  const numericValue = Number(trimmed);
  if (!Number.isFinite(numericValue)) return { value: null, invalid: true };
  return { value: numericValue, invalid: false };
};

const parsePeople = (value) => {
  const trimmed = value.trim();
  if (trimmed === '') return { value: null, empty: true };
  if (!/^\d+$/.test(trimmed)) return { value: null, invalid: true };
  return { value: Number(trimmed), invalid: false };
};

const setError = (input, message) => {
  const container = input.closest('.field, .tip-field');
  const error = document.querySelector(`#${input.getAttribute('aria-describedby')}`);

  container.classList.toggle('has-error', Boolean(message));
  input.setAttribute('aria-invalid', String(Boolean(message)));
  error.textContent = message;
};

const validate = () => {
  const bill = parseAmount(billInput.value);
  const tip = parseAmount(tipInput.value);
  const people = parsePeople(peopleInput.value);
  const errors = {};

  if (bill.empty) errors.bill = '';
  else if (bill.invalid || bill.value <= 0) errors.bill = 'Enter a bill amount greater than 0.';
  else if (bill.value > BILL_UPPER_BOUND) errors.bill = 'Bill cannot exceed $1,000,000,000.';

  if (tip.empty) errors.tip = '';
  else if (tip.invalid || tip.value < 0) errors.tip = 'Enter a tip percentage of 0 or more.';
  else if (tip.value > TIP_UPPER_BOUND) errors.tip = `Tip cannot exceed ${TIP_UPPER_BOUND}%.`;

  if (people.empty) errors.people = '';
  else if (people.invalid || people.value < 1) errors.people = 'Enter a whole number of at least 1.';

  setError(billInput, errors.bill);
  setError(tipInput, errors.tip);
  setError(peopleInput, errors.people);

  return {
    valid: !errors.bill && !errors.tip && !errors.people && !bill.empty && !tip.empty && !people.empty,
    bill: bill.value,
    tip: tip.value,
    people: people.value
  };
};

const updateActivePreset = () => {
  const customValue = tipInput.value.trim();
  tipButtons.forEach((button) => {
    const isActive = button.dataset.tip === customValue;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
};

const setOutputs = ({ tipTotal = 0, grandTotal = 0, perPerson = 0 } = {}) => {
  output.tipTotal.textContent = formatCurrency.format(tipTotal);
  output.grandTotal.textContent = formatCurrency.format(grandTotal);
  output.perPerson.textContent = formatCurrency.format(perPerson);
};

const calculate = () => {
  updateActivePreset();
  const result = validate();

  if (!result.valid) {
    setOutputs();
    return;
  }

  const tipTotal = result.bill * (result.tip / 100);
  const grandTotal = result.bill + tipTotal;
  const perPerson = Math.ceil((grandTotal / result.people) * 100) / 100;

  setOutputs({ tipTotal, grandTotal, perPerson });
};

tipButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
  button.addEventListener('click', () => {
    tipInput.value = button.dataset.tip;
    calculate();
    tipInput.focus();
  });
});

[billInput, tipInput, peopleInput].forEach((input) => {
  input.addEventListener('input', calculate);
});

form.addEventListener('reset', () => {
  requestAnimationFrame(() => {
    billInput.value = DEFAULTS.bill;
    tipInput.value = DEFAULTS.tip;
    peopleInput.value = DEFAULTS.people;
    calculate();
    billInput.focus();
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

calculate();
