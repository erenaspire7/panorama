class Validator {
  public static emailValidator(email: string) {
    let regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regexp.test(email);
  }
}

export default Validator;
