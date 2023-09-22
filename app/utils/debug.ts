export function debugFormData(formData: FormData) {
  console.log("DEBUGGING FORM DATA");
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
}
