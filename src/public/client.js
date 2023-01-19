let store = Immutable.Map({
  user: { name: "Student" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  rover: "",
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (oldStore, newState) => {
  store = store.set(oldStore, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  return `
        <header></header>
        <main>
            ${Greeting(state.get("user").name)}
            <section>
                <h3>Fetch ROVER Information from NASA's API when button is clicked</h3>
                <br>
                <button onclick='roverInfo(RoverImageOfTheDay, 0)'> ${
                  state.get("rovers")[0]
                } </button>
                <button onclick='roverInfo(RoverImageOfTheDay, 1)'> ${
                  state.get("rovers")[1]
                } </button>
                <button onclick='roverInfo(RoverImageOfTheDay, 2)'> ${
                  state.get("rovers")[2]
                } </button>
                <br>
                <br>
                ${fetchInfo()}
            </section>
        </main>
        <footer></footer>
    `;
};

// HOF
const roverInfo = (method, i) => {
  method(store.get("rovers")[i]);
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
function fetchInfo() {
  rover = store.get("rover");
  return rover != ""
    ? `
    <h3><b>Rover Full Name:</b> ${rover.image.latest_photos[0].camera.full_name} </h3>
    <h3><b>Earth Date:</b> ${rover.image.latest_photos[0].earth_date}</h3>
    <h3><b>Landing Date:</b> ${rover.image.latest_photos[0].rover.landing_date}</h3>
    <h3><b>Launch Date:</b> ${rover.image.latest_photos[0].rover.launch_date}</h3>
    <h3><b>Status:</b> ${rover.image.latest_photos[0].rover.status}</h3>
    <img src='${rover.image.latest_photos[0].img_src}' height="350px" width="100%">
    `
    : "";
}

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }
  return `
        <h1>Hello!</h1>
    `;
};

const RoverImageOfTheDay = (rover) => {
  getRoverImageOfTheDay(rover);

  // check if the photo of the day is actually type video!
  if (rover.media_type === "video") {
    return `
        <p>See today's featured video <a href="${rover.url}">here</a></p>
        <p>${rover.title}</p>
        <p>${rover.explanation}</p>
        `;
  } else {
    return fetchInfo();
  }
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());
  console.log(photodate.getDate() === today.getDate());

  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS
const getRoverImageOfTheDay = (state) => {
  fetch(`http://localhost:3000/rovers/${state}`)
    .then((res) => res.json())
    .then((rover) => updateStore("rover", rover));
};

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
  return data;
};
