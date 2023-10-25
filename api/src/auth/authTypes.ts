import Validator from "../utils/validator";
import bcrypt from "bcrypt";

interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class SignUpVerifier {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(data: SignUpRequest) {
    let requiredProps = ["firstName", "lastName", "email", "password"];

    if (!Validator.interfaceValidator(data, requiredProps)) {
      throw Error("Invalid payload received!");
    }

    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;

    if (!Validator.emailValidator(this.email)) {
      throw Error("Invalid Email Provided!");
    }
  }

  async hashPassword() {
    let salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  validate(data: SignUpRequest) {
    return (
      data.firstName != null &&
      data.lastName != null &&
      data.email != null &&
      data.password != null
    );
  }

  deserialize() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      spacedRepetitionPattern: [1, 6, 14, 30],
    };
  }
}

interface SignInRequest {
  email: string;
  password: string;
}

export { SignUpRequest, SignInRequest, SignUpVerifier };
