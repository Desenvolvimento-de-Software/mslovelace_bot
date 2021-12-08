export default class Incoming {

    static index(req: Record<string, any>, res: Record<string, any>) {
        console.log(req.body);
        res.sendStatus(200);
    }
}
