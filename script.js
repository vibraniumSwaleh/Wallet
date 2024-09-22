'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', { name: 'United States dollar', symbol: '$' }],
  ['EUR', { name: 'Euro', symbol: '€' }],
  ['GBP', { name: 'Pound sterling', symbol: '£' }],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let currentAccount;

/////////////////////////////////////////////////

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (account) {
  account.balance = account?.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account?.balance} ${
    currencies.get('EUR').symbol
  }`;
};

const calcDisplaySummary = function (account) {
  const incomes = account?.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const out = account?.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = account?.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account?.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${incomes} ${currencies.get('EUR').symbol}`;
  labelSumOut.textContent = `${Math.abs(out)} ${currencies.get('EUR').symbol}`;
  labelSumInterest.textContent = `${interest} ${currencies.get('EUR').symbol}`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const updateUI = function (account) {
  if (account) {
    displayMovements(account.movements);
    calcPrintBalance(account);
    calcDisplaySummary(account);
  } else {
    console.log('Account not found!');
  }
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGED IN');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
  }
  updateUI(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value.trim()
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  console.log(currentAccount, `Current account: ${currentAccount.balance} €`);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const currentUserName = inputCloseUsername.value.trim();
  const currentUserPin = Number(inputClosePin.value.trim());
  inputCloseUsername.value = inputClosePin.value = '';

  if (
    currentUserName === currentAccount.username &&
    currentUserPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  console.log(`Movements before loan: ${currentAccount.movements}`);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
    console.log(`Movements after loan: ${currentAccount.movements}`);
  }
});

createUserName(accounts);
