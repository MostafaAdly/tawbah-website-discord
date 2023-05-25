export default class Route {
    constructor(data) {
        this.data = data;
    }
    start_Route() {
        this.data.router.get("/", (req, res) => {
            res.send("test is here>>>>>>");
        });
        return this;
    }
}
