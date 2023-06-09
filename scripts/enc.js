// Get the file input element
const fileInput = document.getElementById("file-input");

// Get the password input element
const passwordInput = document.getElementById("password-input");

// Get the encrypt button element
const encryptButton = document.getElementById("encrypt-button");

// Get the download button element
const downloadButton = document.getElementById("download-button");

// When the user clicks the encrypt button
encryptButton.addEventListener("click", () => {
  // Get the selected file
  const file = fileInput.files[0];

  // Create a new FileReader
  const reader = new FileReader();

  // When the FileReader is done reading the file
  reader.addEventListener("load", () => {
    // Get the file contents
    const fileContents = reader.result;

    // Get the password from the input element
    const password = passwordInput.value;

    // Generate a salt for PBKDF2
    const salt = sjcl.random.randomWords(8);

    // Derive a key using PBKDF2
    const key = sjcl.misc.pbkdf2(password, salt, 1000, 256);

    // Encrypt the file using AES 256-bit encryption
    const encryptedFile = sjcl.encrypt(key, fileContents);

    // Create a new Blob object with the encrypted file data and type
    const blob = new Blob([encryptedFile], { type: "text/plain" });

    // Create a new URL object to represent the blob
    const url = URL.createObjectURL(blob);

    // Set the download link's href attribute to the URL
    downloadButton.setAttribute("href", url);

    // Set the download link's download attribute to the original file name with ".enc" appended
    downloadButton.setAttribute("download", file.name + ".enc");

    // Show the download link
    downloadButton.style.display = "block";

    // Store the encrypted file in local storage
    localStorage.setItem("encryptedFile", encryptedFile);

    // Store the salt in local storage
    localStorage.setItem("salt", sjcl.codec.base64.fromBits(salt));
  });

  // Read the file as a data URL
  reader.readAsDataURL(file);
});
