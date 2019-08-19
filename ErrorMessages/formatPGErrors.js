module.exports = function (error) {
  return error.stack.split("\n")[0].split(":")[1].trim();
}