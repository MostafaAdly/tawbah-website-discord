export default class Route {
    constructor(data) {
        this.data = data;
    }
    start_Route() {
        this.data.router.get("/login", (req, res) => {
            res.send("login is here");
        });
        return this;
    }
}
