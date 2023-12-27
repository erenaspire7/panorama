class Validator {
  public static emailValidator(email: string) {
    let regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regexp.test(email);
  }

  public static interfaceValidator(data: any, requiredProp: string[]): boolean {
    return requiredProp.every(
      (property) => data[property] !== undefined && data[property] !== null
    );
  }
}

export default Validator;
