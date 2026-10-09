exports.getDescription = (category, name) => {
  switch (category) {
    case "T-shirt":
      return `${name} is crafted from soft cotton for everyday comfort. Lightweight, breathable, and easy to style across seasons.`;

    case "Hoodie":
      return `${name} is made from soft fleece for warmth and relaxed styling. Perfect for layering in cooler weather.`;

    case "Jacket":
      return `${name} offers a structured fit with a clean silhouette, designed for versatile everyday wear.`;

    case "Jeans":
      return `${name} is crafted from durable denim for everyday comfort, designed to pair effortlessly with any outfit.`;

    case "Shoes":
      return `${name} is built for all-day comfort with a lightweight design and clean, modern styling.`;

    default:
      return `${name} is designed for everyday use with comfort and simplicity in mind.`;
  }
};

exports.getProductInfo = (category) => {
  switch (category) {
    case "T-shirt":
      return ["100% Cotton", "Breathable fabric", "Regular fit"];

    case "Hoodie":
      return ["Fleece fabric", "Relaxed fit", "Machine washable"];

    case "Jacket":
      return ["Polyester blend", "Structured fit", "Dry clean recommended"];

    case "Jeans":
      return ["Denim fabric", "Regular fit", "Machine washable"];

    case "Shoes":
      return ["Rubber sole", "Lightweight design", "Comfort cushioning"];

    default:
      return ["Standard material", "Regular fit"];
  }
};
