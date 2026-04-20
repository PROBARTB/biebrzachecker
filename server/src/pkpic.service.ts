import pkpicClient from "./pkpic.client.js";

const searchConnections = () => {
    await pkpicClient.publicPost("/server/public/endpoint/Pociagi", {
        metoda: "wyszukajPolaczenia",
        //uzupelnic i dodac typ ts
    })
}
const getRoute = () => {}
const checkPrices = () => {}
const fetchCarriageSvg = () => {}
const getComposition = () => {}
//dokonczyc