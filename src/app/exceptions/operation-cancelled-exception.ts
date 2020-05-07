export class OperationCancelledException extends Error {
    public constructor() {
        super('Cancelled');
    }
}
