function toRgba(hex: string, opacity: number) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
  return result;
}

function trim(str: string) {
  return str.replace(/^\s+|\s+$/gm, "");
}

function toHex(rgba: string) {
  var parts = rgba.substring(rgba.indexOf("(")).split(",");
  const r = parseInt(trim(parts[0].substring(1)), 10);
  const g = parseInt(trim(parts[1]), 10);
  const b = parseInt(trim(parts[2]), 10);
  const a = parseFloat(
    trim(parts[3].substring(0, parts[3].length - 1))
  ).toFixed(2);

  return (
    "#" +
    r.toString(16) +
    g.toString(16) +
    b.toString(16) +
    (parseInt(a) * 255).toString(16).substring(0, 2)
  );
}

export default {
  toHex,
  toRgba
};
