// ================================================================= [ Libraries ]
// ================================================================= [ API - Route ]
export default class Route {
    constructor(data) {
        this.data = data;
        this.version = "1";
        this.baseUrl = `/v${this.version}/api`;
    }
    // =================================METHODS================================
    start_Route() {
        this.data.router.get(this.baseUrl + "/total", (req, res) => {
            res.send(":));");
        });
        return this;
    }
}
