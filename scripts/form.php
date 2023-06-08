<?php 

if(isset($_POST['submit'])) {
// Retrieve the password and file details from the form
$password = $_POST['user_pwd_enc'];
$file_name = $_FILES['file_enc_up']['name'];
$file_type = $_FILES['file_upload']['type'];
$file_temp_loc = $_FILES['file_upload']['tmp_name'];

// Generate a new random file name to add an additional layer of security
$file_new_name = bin2hex(random_bytes(16)) . '_' . $file_name;


// Move the uploaded file to a secure location on your server
$secure_upload_dir = '/private/uploads'; // replace with your secure upload directory
if(move_uploaded_file($file_temp_loc, $secure_upload_dir.'/'.$file_new_name)) {

  
  // Read the contents of the uploaded file
  $file_contents = file_get_contents($secure_upload_dir.'/'.$file_new_name);

  // Encrypt the file contents using a suitable encryption algorithm, key length, and mode
  $enc_method = 'aes-256-cbc'; // replace with your encryption method
  $enc_options = 0; // replace with your encryption options
  $enc_iv = random_bytes(openssl_cipher_iv_length($enc_method)); // generate a random initialization vector
  $enc_result = openssl_encrypt($file_contents, $enc_method, $password, $enc_options, $enc_iv);

  // Write the encrypted file contents to a secure location on your server
  $secure_enc_dir = '/private/enc'; // replace with your secure encrypted directory
  file_put_contents($secure_enc_dir.'/'.$file_new_name, $enc_iv.$enc_result);
    }
}
?>