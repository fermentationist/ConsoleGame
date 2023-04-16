export default {
  name: "dog",
  points: 50,
  article: "a",
  takeable: true,
  description: "Four legs. Barks.",
  rescue () {
    Object.getPrototypeOf(this).take.call(this);
  }
}
