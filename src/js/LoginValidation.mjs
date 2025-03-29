export default class LoginValidation {
  constructor(formSelector, validationMessage) {
    this.loginForm = document.getElementById(formSelector);
    this.validationMessage = document.getElementById(validationMessage);

    if (!this.loginForm || !this.validationMessage) {
      throw new Error("Login form or validation message not found.");
    }

    this.init()
  }

  init() {
    this.loginForm.addEventListener("submit", (event) => this.handleSubmit(event))
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    this.validationMessage.textContent = "";

    const loginData = {
      username: username,
      password: password
    };

    try {
      // Send login request to server
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });
      // check if response is successful
      if (response.ok) {
        const data = await response.json();

        // store the token in localStorage
        localStorage.setItem("authToken", data.token);

        // Redirect to orders page
        window.location.replace("/orders/index.html");
      } else {
        const error = await response.json();
        // error message if login failed
        this.validationMessage.textContent = "Unable to login. Please try again or contact support.";
      }
    } catch (error) {
      this.validationMessage.textContent = "An error occurred.";
    }
  }

}
