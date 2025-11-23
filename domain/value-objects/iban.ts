import { InvalidIbanError } from "../errors/invalid-iban-format";
import { mod97 } from "../utils/iban";
import { FRENCH_IBAN_ATTRIBUTES } from "../constants/iban-fr";

export class Iban {
  public constructor(
    public readonly value: string,
  ) { }

  public static create(value: string): Iban | InvalidIbanError {
    const MOD97_EXPECTED_RESULT: number = 1;
    const ASCII_UPPERCASE_A: number = 65;
    const LETTER_TO_NUMBER_OFFSET: number = 10;

    // removing spaces & uppercasing everything
    const cleanedIban = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '');

    // checking IBAN length
    if (cleanedIban.length !== FRENCH_IBAN_ATTRIBUTES.TOTAL_IBAN_LENGTH) {
      return new InvalidIbanError("Invalid IBAN length for country FR");
    }

    // rearranging IBAN for mod97 validation (move country code + check digits to end)
    const rearrangedIban = cleanedIban.slice(FRENCH_IBAN_ATTRIBUTES.IBAN_PREFIX_LENGTH) +
      cleanedIban.slice(0, FRENCH_IBAN_ATTRIBUTES.IBAN_PREFIX_LENGTH);

    // numeric convertion of IBAN for mod97 validation
    const convertedIban = rearrangedIban.replace(/[A-Z]/g, letter =>
      (letter.charCodeAt(0) - ASCII_UPPERCASE_A + LETTER_TO_NUMBER_OFFSET).toString()
    );

    // function used since IBAN can be very long, if mod97 not equal to 1 IBAN is invalid
    const result = mod97(convertedIban);

    if (result !== MOD97_EXPECTED_RESULT) {
      return new InvalidIbanError("IBAN failed mod97 check");
    }

    return new Iban(cleanedIban);
  }

  public static generate(
    bankCode: string,
    branchCode: string,
    accountNumber: string
  ): Iban | InvalidIbanError {
    const ASCII_UPPERCASE_A: number = 65;
    const LETTER_TO_NUMBER_OFFSET: number = 10;
    const MOD97_DIVISOR: bigint = 97n;
    const IBAN_MOD97_TARGET: number = 98;

    // validate lengths
    if (bankCode.length !== FRENCH_IBAN_ATTRIBUTES.BANK_CODE_LENGTH) {
      return new InvalidIbanError(`Bank code must be ${FRENCH_IBAN_ATTRIBUTES.BANK_CODE_LENGTH} digits`);
    }
    if (branchCode.length !== FRENCH_IBAN_ATTRIBUTES.BRANCH_CODE_LENGTH) {
      return new InvalidIbanError(`Branch code must be ${FRENCH_IBAN_ATTRIBUTES.BRANCH_CODE_LENGTH} digits`);
    }
    if (accountNumber.length !== FRENCH_IBAN_ATTRIBUTES.ACCOUNT_NUMBER_LENGTH) {
      return new InvalidIbanError(`Account number must be ${FRENCH_IBAN_ATTRIBUTES.ACCOUNT_NUMBER_LENGTH} digits`);
    }

    // calculate RIB key
    const ribNumeric: bigint = BigInt(`${bankCode}${branchCode}${accountNumber}`.replace(/[A-Z]/gi, c =>
      (c.toUpperCase().charCodeAt(0) - ASCII_UPPERCASE_A + LETTER_TO_NUMBER_OFFSET).toString()
    ));

    const ribKey: string = (MOD97_DIVISOR - (ribNumeric % MOD97_DIVISOR)).toString().padStart(FRENCH_IBAN_ATTRIBUTES.CHECK_DIGITS_LENGTH, '0');

    // build BBAN
    const bban = bankCode + branchCode + accountNumber + ribKey;

    // prepare IBAN with placeholder check digits
    const ibanWithPlaceholder = bban + FRENCH_IBAN_ATTRIBUTES.COUNTRY_CODE + '00';

    // convert letters to numbers for mod97
    const convertedIban = ibanWithPlaceholder.replace(/[A-Z]/g, letter =>
      (letter.charCodeAt(0) - ASCII_UPPERCASE_A + LETTER_TO_NUMBER_OFFSET).toString()
    );

    // compute check digits
    const remainder = mod97(convertedIban);
    const checkDigits = (IBAN_MOD97_TARGET - remainder).toString().padStart(FRENCH_IBAN_ATTRIBUTES.CHECK_DIGITS_LENGTH, '0');

    // assemble final IBAN
    const finalIban = FRENCH_IBAN_ATTRIBUTES.COUNTRY_CODE + checkDigits + bban;

    // validate final IBAN
    const ibanOrError = Iban.create(finalIban);
    if (ibanOrError instanceof InvalidIbanError) return ibanOrError;

    return ibanOrError;
  }

  public static getAccountNumber(iban: string): string | InvalidIbanError {
    if (iban.length !== FRENCH_IBAN_ATTRIBUTES.TOTAL_IBAN_LENGTH) {
      return new InvalidIbanError("Invalid IBAN length");
    }

    const sliceStart = FRENCH_IBAN_ATTRIBUTES.IBAN_PREFIX_LENGTH + FRENCH_IBAN_ATTRIBUTES.BANK_CODE_LENGTH + FRENCH_IBAN_ATTRIBUTES.BRANCH_CODE_LENGTH;
    const sliceEnd = sliceStart + FRENCH_IBAN_ATTRIBUTES.ACCOUNT_NUMBER_LENGTH;

    return iban.slice(sliceStart, sliceEnd);
  }
}
