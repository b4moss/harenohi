export class HolidayInputError extends Error {
  readonly name = 'HolidayInputError'

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
