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
    const { firstName, lastName, email, password } = data;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;

    // Validate
    let res = Validator.emailValidator(this.email);

    if (!res) {
      throw Error("Invalid Email Provided!");
    }
  }

  async hashPassword() {
    let salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  deserialize() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };
  }
}

interface SignInRequest {
  email: string;
  password: string;
}

class SignInVerifier {
  email: string;
  password: string;

  constructor(data: SignInRequest) {
    const { email, password } = data;

    this.email = email;
    this.password = password;
  }
}

export { SignUpRequest, SignInRequest, SignUpVerifier, SignInVerifier };
