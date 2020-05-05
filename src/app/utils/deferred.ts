export class Deferred<T> {
    public resolve!: (value?: T | Promise<T>) => void;
    public reject!: (reason?: unknown) => void;
    public promise: Promise<T>;

    public constructor() {
        this.promise = new Promise<T>((resolve, reject): void => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
