import dayjs from "dayjs";

function formatDate(date) {
  return dayjs(date).format("DD MMM, YYYY");
}

export default formatDate;
