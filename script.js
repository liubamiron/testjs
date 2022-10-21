

const costAB = 700;
const costBA = 1200;
const travelTimeMinutes = 50;

const timesAB = `
  2021-08-21 18:00:00
  2021-08-21 18:30:00
  2021-08-21 18:45:00
  2021-08-21 19:00:00
  2021-08-21 19:15:00
  2021-08-21 21:00:00

`;

const timesBA = `
2021-08-21 18:30:00
2021-08-21 18:45:00
2021-08-21 19:00:00
2021-08-21 19:15:00
2021-08-21 19:35:00
2021-08-21 21:50:00
2021-08-21 21:55:00
`;

const parseTimes = (times) =>
  times
    .trim()
    .split("\n")
    .map((str) => new Date(str.trim()));

const datesAB = parseTimes(timesAB);

const datesBA = parseTimes(timesBA);

const el = Object.fromEntries(
  ["direction", "timesAB", "timesBA", "blockAB", "blockBA", "output"].map(
    (id) => [id, document.getElementById(id)]
  )
);

const ll = (n) => n.toString().padStart(2, "0");

const createOptions = (datesArray, id) => {
  datesArray.forEach((time) => {
    const option = document.createElement("option");
    option.value = time.getTime();
    option.innerText = `${ll(time.getHours())}:${ll(time.getMinutes())}`;
    el[id].appendChild(option);
  });
};

createOptions(datesAB, "timesAB");
createOptions(datesBA, "timesBA");

const filterBAOptions = () => {
  let latest = 0; // no limits
  if (el.direction.value & 1) {
    // A->B active
    latest = +el.timesAB.value + travelTimeMinutes * 6e4;
  }
  const isSelectionValid = +el.timesBA.value >= latest;
  let isFixApplied = false;

  el.timesBA.querySelectorAll("option").forEach((opt) => {
    if (+opt.value < latest) {
      opt.setAttribute("disabled", "disabled");
    } else {
      opt.removeAttribute("disabled");
      if (!isSelectionValid && !isFixApplied) {
        el.timesBA.value = opt.value;
        isFixApplied = true;
      }
    }
  });
};

const onDirectionChange = () => {
  const bits = +el.direction.value;
  el.blockAB.classList[bits & 1 ? "remove" : "add"]("hidden");
  el.blockBA.classList[bits & 2 ? "remove" : "add"]("hidden");
};

const updateTimes = () => {
  const abTime = el.timesAB.value;
  const baTime = el.timesBA.value;
};

const abTime = el.timesAB.value;

const timeT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
}).format(el.timesAB.value);

const timeT2 = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
}).format(el.timesBA.value);

console.log("el", el);

// console.log(new Intl.DateTimeFormat('en-US', {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: false,}).format(el.timesAB.value + 2700));

console.log("a", el.timesAB.value);
console.log(parseTimes.timesAB);
console.log("b", +el.timesAB.value + travelTimeMinutes * 6e4);
console.log("c", datesAB);

const printTicket = () => {
  // const route =
  const cost =
    1 *
    ((el.direction.value & 1 ? costAB : 0) +
      (el.direction.value & 2 && costBA));
  const timeT =
    1 *
    ((+el.direction.value & 1 ? travelTimeMinutes : 0) +
      (+el.direction.value & 2 && travelTimeMinutes));
      
  el.output.innerHTML = `
 <p>4 билета по маршруту из A в B стоимостью ${cost} руб.</p>
<p>стоимость 4 билетов ${cost}</p>
<p>Это путешествие займет у вас ${timeT} минут.</p>
<p>Теплоход отправляется  с пункта А в ${new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(el.timesAB.value)}прибудет в
       (${new Intl.DateTimeFormat("en-US", {
         hour: "numeric",
         minute: "numeric",
         hour12: false,
       }).format(el.timesAB.value)}+00:${timeT - 5})
    </p>

    <p>Теплоход отправляется  с пункта B в
        ${new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).format(el.timesBA.value)} прибудет в
           (${new Intl.DateTimeFormat("en-US", {
             hour: "numeric",
             minute: "numeric",
             hour12: false,
           }).format(el.timesBA.value)}+00:${timeT - 5})
        </p>

        <p>Теплоход отправляется  с пункта А в ${new Intl.DateTimeFormat(
          "en-US",
          {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }
        ).format(el.timesAB.value)} отправляется с пункта B в
            ${new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            }).format(el.timesBA.value)} прибудет в
               (${new Intl.DateTimeFormat("en-US", {
                 hour: "numeric",
                 minute: "numeric",
                 hour12: false,
               }).format(el.timesBA.value)}+00:${timeT - 55})
            </p>
`;
};

const update = () => (onDirectionChange(), filterBAOptions(), printTicket());

el.direction.addEventListener("change", update);
el.timesAB.addEventListener("change", update);
el.timesBA.addEventListener("change", update);


update();


