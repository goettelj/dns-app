export default function fibonacci(number, memo) {
  // credit for algorithm:
  // https://medium.com/developers-writing/fibonacci-sequence-algorithm-in-javascript-b253dc7e320e
  memo = memo || {};

  if (memo[number]) return memo[number];
  if (number <= 1) return 1;

  return (memo[number] =
    fibonacci(number - 1, memo) + fibonacci(number - 2, memo));
}
