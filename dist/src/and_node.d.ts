export default class AndNode implements ISelector {
    constructor(children: ISelector[]);
    children: ISelector[];
    matches(labels: Record<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
