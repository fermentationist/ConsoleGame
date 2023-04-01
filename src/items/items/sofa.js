export default (game) => {
  return {
    name: "sofa",
    flammable: true,
    listed: false,
    description:
      "The well-worn sitting room sofa is upholstered brown cowhide.",
    burn () {
      Object.getPrototypeOf(this).burnDown.call(this);
    },
  };
};
