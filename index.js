import UtilForm from "./create-form.js";
const FormElements = document.getElementsByTagName("form");
const contactFormEl = [...FormElements].find((el) => el.id === "contact-form");
const contactForm = new UtilForm(contactFormEl);
const prototypeText = contactFormEl
  .querySelector('label[for="fileUpload"] span')
  .textContent.trim();
const displayUploadedFile = (e) => {
  const target = e.target;
  const filePath = target.value;
  const fileComponents =
    filePath.split("/").length > 1 ? filePath.split("/") : filePath.split("\\");
  const fileName = fileComponents[fileComponents.length - 1];
  const label = target.closest("label");
  const labelSpan = label.querySelector("span");
  if (e.target.files.length > 0) {
    labelSpan.textContent = fileName;
  } else {
    labelSpan.textContent = prototypeText;
  }
};

contactFormEl
  .querySelector('input[type="file"]')
  .addEventListener("change", displayUploadedFile);

// GET DATA V
contactFormEl.addEventListener("submit", (e) => {
  const response = contactForm.getData(e);

  if (response.ok) {
    const data = response.data;
    console.log(data);
    /*
      if fetch response ok {
        contactForm.success();
      } else {
        contactForm.fail();
      }
       ...
       */
    contactForm.errorMessage("Error Message");
    // contactForm.success();
  } else {
  }
});
