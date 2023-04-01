export default {
  name: "dog",
  points: 50,
  article: "a",
  takeable: true,
  description: "Four legs. barks.",
  rescue () {
    Object.getPrototypeOf(this).take.call(this);
  }
}
