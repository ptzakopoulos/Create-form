# Create-form
This is a small, lightweight TypeScript library for building and validating dynamic, accessible HTML forms using a class-based approach.

# How to use
 - Form elements should be wrapped with a .input-block div.
 - All .input-block containers should have an input and 2 error messages (like in example).
 - If an input is required its .input-block container should have a .required class.
 - If an input should be validated its .input-block should have a .validate class and an "as" attribute with possible values =>   
  | "name"
  | "fullname"
  | "email"
  | "greekmobilephone"
  | "greekphone"
  | "phone".
 - The dynamic fields should have a (a)"dynamic-parent" and a (b)"dynamic-value" attribute with values (a) the id of the parent input (b) the value that triggers that field.

You will find all necessary informations at the repository's files/example.
