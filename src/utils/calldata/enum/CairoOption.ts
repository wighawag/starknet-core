import { ValuesType } from '../../../types/helpers/valuesType.js';
import { isUndefined } from '../../typed.js';

export const CairoOptionVariant = {
  Some: 0,
  None: 1,
} as const;

export type CairoOptionVariant = ValuesType<typeof CairoOptionVariant>;

/**
 * Class to handle Cairo Option
 * @param variant CairoOptionVariant.Some or CairoOptionVariant.None
 * @param content value of type T.
 * @returns an instance representing a Cairo Option.
 * @example
 * ```typescript
 * const myOption = new CairoOption<BigNumberish>(CairoOptionVariant.Some, "0x54dda8");
 * ```
 */
export class CairoOption<T> {
  readonly Some?: T;

  readonly None?: boolean;

  constructor(variant: CairoOptionVariant | number, content?: T) {
    if (!(variant in Object.values(CairoOptionVariant))) {
      throw new Error('Wrong variant! It should be CairoOptionVariant.Some or .None.');
    }
    if (variant === CairoOptionVariant.Some) {
      if (isUndefined(content)) {
        throw new Error(
          'The creation of a Cairo Option with "Some" variant needs a content as input.'
        );
      }
      this.Some = content;
      this.None = undefined;
    } else {
      this.Some = undefined;
      this.None = true;
    }
  }

  /**
   *
   * @returns the content of the valid variant of a Cairo custom Enum.
   *  If None, returns 'undefined'.
   */
  public unwrap(): T | undefined {
    return this.None ? undefined : this.Some;
  }

  /**
   *
   * @returns true if the valid variant is 'isSome'.
   */
  public isSome(): boolean {
    return !isUndefined(this.Some);
  }

  /**
   *
   * @returns true if the valid variant is 'isNone'.
   */
  public isNone(): boolean {
    return this.None === true;
  }
}
