module.exports = function (error) {

  if (error.stack) {
    return error.stack.split("\n")[0].split(":")[1].trim();
  } else {
    return "No error was passed down.";
  }
}