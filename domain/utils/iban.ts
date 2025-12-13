export function mod97(digits: string): number {
  const MIN_DIGITS_FOR_RECURSION: number = 2;
  const MAX_CHUNK_LENGTH: number = 9;
  const MODULUS: number = 97;
  const DECIMAL_RADIX: number = 10;

  if (digits.length <= MIN_DIGITS_FOR_RECURSION) {
    return parseInt(digits, DECIMAL_RADIX) % MODULUS;
  }

  const chunk = digits.slice(0, MAX_CHUNK_LENGTH);
  const remainder = parseInt(chunk, DECIMAL_RADIX) % MODULUS;
  return mod97(remainder.toString() + digits.slice(chunk.length));
}
