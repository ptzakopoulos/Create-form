export default class Form {
    constructor(form) {
        this.clearErrorMessages = (block) => {
            var _a, _b;
            let input;
            input =
                (_b = (_a = block.querySelector("input")) !== null && _a !== void 0 ? _a : block.querySelector("select")) !== null && _b !== void 0 ? _b : block.querySelector("textarea");
            const errorMessages = block.querySelectorAll(".error-message");
            input === null || input === void 0 ? void 0 : input.addEventListener("focus", () => {
                errorMessages.forEach((message) => {
                    message.classList.remove("active");
                });
            });
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                input.addEventListener("change", (e) => {
                    const target = e.target;
                    if (target.checked) {
                        errorMessages.forEach((message) => {
                            message.classList.remove("active");
                        });
                    }
                });
            }
        };
        this.requiredFieldsareFilled = () => {
            this.requiredFields.forEach((field) => {
                var _a, _b;
                let input;
                input =
                    (_b = (_a = field.querySelector("input")) !== null && _a !== void 0 ? _a : field.querySelector("select")) !== null && _b !== void 0 ? _b : field.querySelector("textarea");
                if (input) {
                    if (input.name === "submit")
                        return;
                    const errorMessageRequired = field.querySelector('.error-message[error-type="required"]');
                    if (input.value.trim() == "" || input.value.length <= 0) {
                        errorMessageRequired === null || errorMessageRequired === void 0 ? void 0 : errorMessageRequired.classList.add("active");
                    }
                    if (input instanceof HTMLInputElement && input.type === "checkbox") {
                        errorMessageRequired === null || errorMessageRequired === void 0 ? void 0 : errorMessageRequired.classList.toggle("active", !input.checked);
                    }
                    if (input instanceof HTMLInputElement &&
                        input.type === "radio" &&
                        (this.form[input.name].value === "" ||
                            this.form[input.name].value.length <= 0)) {
                        errorMessageRequired === null || errorMessageRequired === void 0 ? void 0 : errorMessageRequired.classList.add("active");
                    }
                }
            });
            const filedsAreFilled = [...this.requiredFields].every((field) => {
                var _a, _b;
                let input;
                input =
                    (_b = (_a = field.querySelector("input")) !== null && _a !== void 0 ? _a : field.querySelector("select")) !== null && _b !== void 0 ? _b : field.querySelector("textarea");
                if (input) {
                    if (input.name === "submit")
                        return true;
                    if (input instanceof HTMLInputElement && input.type === "checkbox") {
                        if (input.checked)
                            return true;
                        if (!input.checked)
                            return false;
                    }
                    if (input.value && input.value.trim() != "" && input.value.length > 0) {
                        return true;
                    }
                    return false;
                }
                return true;
            });
            return filedsAreFilled;
        };
        this.validate = () => {
            const validationArray = [];
            this.validationFields.forEach((field) => {
                if (!field) {
                    throw new Error("Inputs should be inside and .input-block element");
                }
                const input = field.querySelector("input");
                if (!input)
                    throw new Error("Input was not found in" + field);
                const value = input.value;
                const errorMessageValidate = field.querySelector('.error-message[error-type="validate"]');
                if (!errorMessageValidate)
                    throw new Error('Each input-block should contain an .error-message with property [error-type="validate"] and an .error-message with property [error-type="required"]');
                const validationType = field.getAttribute("as");
                if (validationType != "email" &&
                    validationType != "fullname" &&
                    validationType != "greekmobilephone" &&
                    validationType != "greekphone" &&
                    validationType != "name")
                    throw new Error('Property "as" should contain one of the following : "fullname", "email", "password", "greekmobilephone", "greekphone"');
                if (!validationType)
                    throw new Error('Input blocks should have an "as" property. This property specifies the way the input is going to be validated.');
                if (!this.validations[validationType].test(value)) {
                    errorMessageValidate.classList.add("active");
                }
                else {
                    errorMessageValidate.classList.remove("active");
                }
                validationArray.push(this.validations[validationType].test(value));
            });
            return validationArray.every((item) => item === true);
        };
        this.liveValidation = (e) => {
            const target = e.target;
            const inputBlock = target.closest(".input-block");
            const validationType = inputBlock === null || inputBlock === void 0 ? void 0 : inputBlock.getAttribute("as");
            const errorMessageValidate = inputBlock === null || inputBlock === void 0 ? void 0 : inputBlock.querySelector('.error-message[error-type="validate"]');
            if (validationType &&
                (validationType === "email" ||
                    validationType === "fullname" ||
                    validationType === "greekmobilephone" ||
                    validationType === "greekphone" ||
                    validationType === "name")) {
                const isValid = this.validations[validationType].test(target.value.trim());
                errorMessageValidate === null || errorMessageValidate === void 0 ? void 0 : errorMessageValidate.classList.toggle("active", !isValid);
            }
            if (target.value.trim() == "")
                errorMessageValidate === null || errorMessageValidate === void 0 ? void 0 : errorMessageValidate.classList.remove("active");
        };
        this.dynamicFieldsToggle = () => {
            this.dynamicFields.forEach((field) => {
                var _a;
                const fieldParentId = field.getAttribute("dynamic-parent");
                const parentInput = (_a = this.form.querySelector(`#${fieldParentId}`)) !== null && _a !== void 0 ? _a : this.form.querySelector(`[name="${fieldParentId}"]`);
                if (!parentInput)
                    throw new Error("One of the dynamic fields doesn't have an existing dynamic-parent value.");
                const targetParentValue = field.getAttribute("dynamic-value");
                parentInput.addEventListener("change", (e) => {
                    const target = e.target;
                    if (target.type === "checkbox") {
                        field.classList.toggle("active", target.checked);
                    }
                    if (target.type === "radio") {
                        if (!targetParentValue)
                            throw new Error("Dynamic field does not have a dynamic-value.");
                        field.classList.toggle("active", target.value === targetParentValue);
                    }
                    if (target.type === "select-one") {
                        if (!targetParentValue)
                            throw new Error("Dynamic field does not have a dynamic-value.");
                        field.classList.toggle("active", target.value === targetParentValue);
                    }
                    this.dynamicFieldsDispense();
                });
            });
        };
        this.dynamicFieldsDispense = () => {
            this.dynamicFields.forEach((field) => {
                var _a;
                if (field.classList.contains("active")) {
                    if (field.classList.contains("required") &&
                        !this.requiredFields.find((rf) => rf === field)) {
                        this.requiredFields.push(field);
                    }
                    if (field.classList.contains("validate") &&
                        !this.validationFields.find((rf) => rf === field)) {
                        this.validationFields.push(field);
                    }
                }
                else {
                    if (field.classList.contains("required") &&
                        this.requiredFields.find((rf) => rf === field)) {
                        const i = this.requiredFields.findIndex((rf) => rf === field);
                        i >= 0 && this.requiredFields.splice(i, 1);
                    }
                    if (field.classList.contains("validate") &&
                        this.validationFields.find((rf) => rf === field)) {
                        const i = this.validationFields.findIndex((rf) => rf === field);
                        i >= 0 && this.validationFields.splice(i, 1);
                    }
                    const input = (_a = field.querySelector("input")) !== null && _a !== void 0 ? _a : field.querySelector("select");
                    if (input instanceof HTMLInputElement)
                        input.value = "";
                    if (input instanceof HTMLInputElement && input.type === "checkbox")
                        input.checked = false;
                    if (input instanceof HTMLSelectElement)
                        input.value = "";
                    input === null || input === void 0 ? void 0 : input.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });
        };
        this.reset = () => {
            this.form.reset();
        };
        this.success = () => {
            const successMessage = this.form.querySelector(".success-message");
            if (!successMessage)
                throw new Error("For does not contain a .success-message.");
            const submitBt = this.form.querySelector('input[type="submit"]');
            if (!submitBt)
                throw Error("Form is missing a submit button.");
            successMessage.classList.add("active");
            submitBt.disabled = true;
            setTimeout(() => {
                successMessage.classList.remove("active");
                submitBt.disabled = false;
            }, 2000);
        };
        this.fail = () => {
            const failMessage = this.form.querySelector(".fail-message");
            if (!failMessage)
                throw new Error("For does not contain a .fail-message.");
            failMessage.classList.add("active");
            setTimeout(() => {
                failMessage.classList.remove("active");
            }, 4000);
        };
        this.errorMessage = (message) => {
            const failMessageEl = this.form.querySelector(".fail-message");
            if (!failMessageEl)
                throw new Error("No .fail-message was found in form.");
            failMessageEl.textContent = message.trim();
            this.fail();
        };
        this.getData = (e) => {
            e.preventDefault();
            this.dynamicFieldsDispense();
            if (!this.requiredFieldsareFilled()) {
                return {
                    ok: false,
                    message: "Required fileds are not filled.",
                };
            }
            if (!this.validate())
                return {
                    ok: false,
                    message: "Validation failed.",
                };
            const formData = new FormData(this.form);
            for (const [key, value] of formData.entries()) {
                this.formData[key] = value.toString();
            }
            if (this.formData.hp) {
                return {
                    ok: false,
                    message: "Bot detected.",
                };
            }
            return {
                ok: true,
                data: this.formData,
            };
        };
        this.form = form;
        this.requiredFields = [];
        this.validationFields = [];
        this.dynamicFields = [];
        this.validations = {
            name: /^[A-Za-z\u0370-\u03FF\u1F00-\u1FFF]+$/,
            fullname: /^(?=(?:[^ ]* ){0,1}[^ ]*$)[\p{Script=Latin}\p{Script=Greek} ]+$/u,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            greekmobilephone: /^(?:\+3069\d{8}|69\d{8})$/,
            greekphone: /^\d{10}$/,
            phone: /^\+?\d+$/,
        };
        this.formData = {};
        this.init();
    }
    init() {
        if (!this.form)
            throw new Error("Form should be a Node Elements. In this case it is" + typeof this.form);
        const inputBlocks = this.form.querySelectorAll(".input-block");
        if (inputBlocks && inputBlocks.length > 0) {
            inputBlocks.forEach((block) => {
                this.clearErrorMessages(block);
                const input = block.querySelector("input");
                input === null || input === void 0 ? void 0 : input.addEventListener("keyup", this.liveValidation);
                if (block.classList.contains("dynamic")) {
                    this.dynamicFields.push(block);
                    return;
                }
                if (block.classList.contains("required")) {
                    this.requiredFields.push(block);
                }
                if (block.classList.contains("validate")) {
                    this.validationFields.push(block);
                }
            });
            this.dynamicFieldsToggle();
        }
    }
}
