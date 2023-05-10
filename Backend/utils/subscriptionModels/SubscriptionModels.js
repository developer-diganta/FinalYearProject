export default class MubscriptionModels {

    constructor() {
        this.subscription = new Map();
    }

    alterSubscription(year, cost) {
        if (this.subscription.get(year)) {
            this.subscription.set(year, cost);
        }
        else {
            this.subscription.set(year, cost);
        }
    }

    getSubscription(year) {
        return this.subscription.get(year);
    }

}