// module.exports = getDate;

function getDate() {
  const event = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return event.toLocaleDateString(undefined, options);
}
export default getDate;
