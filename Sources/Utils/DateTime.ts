import moment from "moment";

function format(format: string, date: Date = new Date()) {
  return moment(date).format(format);
}
export default {
  format
};
