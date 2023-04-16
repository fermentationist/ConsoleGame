export default (game) => {
  return {
			name: "bed",
			flammable: true,
			takeable: false,
			listed:false,
			description: "The antique bedframe is made of tubular bronze. There are not any sheets or blankets or pillows on the old, stained, queen-sized mattress that rests atop it.",
			burn () {
				Object.getPrototypeOf(this).burnDown.call(this);
			},
		}
}