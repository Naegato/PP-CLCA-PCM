export function mod97(digits) {
    const MIN_DIGITS_FOR_RECURSION = 2;
    const MAX_CHUNK_LENGTH = 9;
    const MODULUS = 97;
    const DECIMAL_RADIX = 10;
    if (digits.length <= MIN_DIGITS_FOR_RECURSION) {
        return parseInt(digits, DECIMAL_RADIX) % MODULUS;
    }
    const chunk = digits.slice(0, MAX_CHUNK_LENGTH);
    const remainder = parseInt(chunk, DECIMAL_RADIX) % MODULUS;
    return mod97(remainder.toString() + digits.slice(chunk.length));
}
//# sourceMappingURL=iban.js.map