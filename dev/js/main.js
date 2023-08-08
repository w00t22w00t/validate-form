addEventListener("DOMContentLoaded", (event) => {

  document.querySelectorAll(".dropdown").forEach(function (dropdownWrapper) {
    const dropdownBtn = dropdownWrapper.querySelector(".dropdown__button");
    const dropdownBtnTxt = dropdownBtn.querySelector("span");
    const dropdownList = dropdownWrapper.querySelector(".dropdown__list");
    const dropdownItems = dropdownList.querySelectorAll(".dropdown__list-item");
    const dropdownInput = dropdownWrapper.querySelector(
      ".dropdown__input_hidden"
    );

    var phoneInput = document.querySelector('#phone');

    dropdownBtn.addEventListener("click", function() {
      dropdownList.classList.toggle("dropdown__list_visible");
      dropdownBtn.classList.toggle("dropdown__button_active");
      dropdownWrapper.classList.add("selected");
    });

    dropdownItems.forEach(function (listItem) {
      listItem.addEventListener("click", function (e) {
        dropdownItems.forEach(function (el) {
          el.classList.remove("dropdown__list-item_active");
        });
        e.target.classList.add("dropdown__list-item_active");
        dropdownBtnTxt.innerText = this.innerText;
        dropdownInput.value = this.dataset.value;
        dropdownList.classList.remove("dropdown__list_visible");

        const countryCode = this.dataset.code.replace(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,3})/, '$1 $2 $3 $4');
        phoneInput.value = countryCode;
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target !== dropdownBtn) {
        dropdownBtn.classList.remove("dropdown__button_active");
        dropdownList.classList.remove("dropdown__list_visible");

        if (dropdownBtnTxt.innerText.trim() === '') {
          dropdownWrapper.classList.remove("selected");
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab" || e.key === "Escape") {
        dropdownBtn.classList.remove("dropdown__button_active");
        dropdownList.classList.remove("dropdown__list_visible");
      }
    });
  });



  document.getElementById("form").addEventListener("submit", function (event) {
     // Prevent form submission if invalid
     if (!validateForm()) {
      event.preventDefault();
     }
  });

  function validateForm() {
    // Get form elements
    const name = document.querySelector("#name");
    const secondName = document.querySelector("#second_name");
    const telephone = document.querySelector('#phone');
    const spanErrors = document.querySelectorAll(".registration__input-error");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm_password");
    const email = document.querySelector("#email");
    const dropdownTxt = document.querySelector('.dropdown__button > span');
    const terms = document.querySelector('#terms');
    const termsContainer = document.querySelector('.registration__input-checkbox');

    // Strings with errors
    const strLengthErr = "The name must be more than 2 characters";
    const strPasswordErr = "Password must have 1 letter, 1 number and one symbol";
    const strCPasswordErr = "Password does not match";
    const strEmailErr = "Email is not correct";
    const strFillErr = "Fill in the field";

    // Password pattern
    const pattern = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])/);

    // Validation checks
    let isValid = true;

    // Check if name is filled
    if (name.value <= 2) {
      spanErrors[0].textContent = strLengthErr;
      isValid = false;
    } else {
      spanErrors[0].textContent = ""; // Reset error
    }

    // Check if second name is filled
    if (secondName.value <= 2) {
      spanErrors[1].textContent = strLengthErr;
      isValid = false;
    } else {
      spanErrors[1].textContent = ""; // Reset error
    }

    // Check if password is filled and valid format
    if (dropdownTxt.textContent.trim() === '') {
      spanErrors[2].textContent = strFillErr;
    } else {
      spanErrors[2].textContent = ""; // Reset error
    }

    // Check if telephone is filled
    if (telephone.value.length < 14) {
      spanErrors[3].textContent = strFillErr;
      isValid = false;
    } else {
      spanErrors[3].textContent = ""; // Reset error
    }
    

    // Check if password is filled and valid format
    if (password.value.trim() === '') {
      spanErrors[4].textContent = strFillErr;
    } else if (!pattern.test(password.value)) {
      spanErrors[4].textContent = strPasswordErr;
      isValid = false;
    } else {
      spanErrors[4].textContent = ""; // Reset error
    }

    // Check if confirm password
    if (confirmPassword.value.trim() === '') {
      spanErrors[5].textContent = strFillErr;
    } else if (password.value !== confirmPassword.value) {
      spanErrors[5].textContent = strCPasswordErr;
      isValid = false;
    } else {
      spanErrors[5].textContent = ""; // Reset error
    }

    // Check if email is filled and valid format
    if (email.value.trim() === '') {
      spanErrors[6].textContent = strFillErr;
    } else if (!isValidEmail(email.value)) {
      spanErrors[6].textContent = strEmailErr;
      isValid = false;
    } else {
      spanErrors[6].textContent = ""; // Reset error
    }

    // Check terms
    if (!terms.checked) {
      termsContainer.classList.add('error');
    } else {
      termsContainer.classList.remove('error');
    }



    return isValid;
  }

  function isValidEmail(email) {
    // A simple email format check using regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Get the phone input element
  const phoneInput = document.querySelector('#phone');
  

  function maskPhoneInput(e) {
    // Remove any non-numeric characters from the input
    let phoneNumber = phoneInput.value.replace(/\D/g, '');

    // Check if the phone number starts with a country code
    const countryCode = '+';
    if (phoneNumber.startsWith(countryCode)) {
      // Remove the country code from the phone number
      phoneNumber = phoneNumber.substring(1);
    }

    // Check if the phone number exceeds the maximum length
    const maxLength = 10;
    if (phoneNumber.length > maxLength) {
      phoneNumber = phoneNumber.substring(0, maxLength);
    }


    // Format the phone number as +X XXX XXX XXX
    let formattedNumber = phoneNumber.replace(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,3})/, '$1 $2 $3 $4');

    // Add the country code back to the phone number
    formattedNumber = countryCode + formattedNumber;

    // Update the value of the phone input field without changing the entered value
    if (e.inputType !== "deleteContentBackward") {
      phoneInput.value = formattedNumber;
    }
    
  }

  phoneInput.addEventListener('input', maskPhoneInput)


});

