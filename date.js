exports.first = function(){
  let today = new Date();
  let options ={
    weekday: "long",
    day: "numeric",
    month: "long"};
  return today.toLocaleDateString("en-US", options);
}

exports.second = function (){
  let today = new Date();
  let options ={
    weekday: "long",
};
  return today.toLocaleDateString("en-US", options);
}

console.log(module.exports);
