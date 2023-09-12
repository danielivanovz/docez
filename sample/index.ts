/* doc */
function one(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  }

  return n * one(n - 1);
}

/* doc */
const two = (n: number): number => {
  let memo = [];

  memo[0] = 1;

  for (var i = 1; i <= n; i++) {
    memo[i] = i * memo[i - 1];
  }

  return memo[n];
};

/* zdoc */
const lambda = one(5);

/* docz */
const phi = two(5);